module alonix5::brand_nft_collection {
    use std::signer;
    use std::string::String;
    use aptos_framework::account;
    use aptos_framework::object;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_std::smart_table::{Self, SmartTable};
    use aptos_std::event::{Self, EventHandle};
    use aptos_std::table::{Self, Table};
    use std::option::{Self, Option};

    // Error codes
    const E_UNAUTHORIZED: u64 = 1;
    const E_COLLECTION_NOT_EXISTS: u64 = 2;
    const E_TOKEN_NOT_EXISTS: u64 = 3;
    const E_INSUFFICIENT_SUPPLY: u64 = 4;

    // Struct to manage brand collections
    struct BrandCollectionManager has key {
        collections: SmartTable<String, CollectionInfo>,
        create_collection_events: EventHandle<CreateCollectionEvent>,
        mint_nft_events: EventHandle<MintNFTEvent>,
        burn_nft_events: EventHandle<BurnNFTEvent>
    }

    struct NftCollection has key {
        collection_id: String,
        tokens: Table<String, TokenRefs>
    }

    // Add copy ability to allow dereferencing
    struct TokenRefs has store, drop {
        transfer_ref: object::TransferRef,
        burn_ref: token::BurnRef
    }

    // Add copy ability to allow dereferencing
    struct CollectionInfo has store, drop, copy {
        creator: address,
        description: String,
        supply: u64,
        price: u64,
        metadata_uri: String,
        total_minted: u64
    }

    // Events (unchanged)
    struct CreateCollectionEvent has drop, store {
        creator: address,
        collection_name: String,
        description: String,
        supply: u64
    }

    struct MintNFTEvent has drop, store {
        collection_name: String,
        token_name: String,
        minter: address,
        to_address: address
    }

    struct BurnNFTEvent has drop, store {
        collection_name: String,
        token_name: String,
        owner: address
    }

    // Initialize module and create resource account
    fun init_module(owner: &signer) {
        let owner_addr = signer::address_of(owner);
        if (!exists<BrandCollectionManager>(owner_addr)) {
            move_to(owner, BrandCollectionManager {
                collections: smart_table::new(),
                create_collection_events: account::new_event_handle<CreateCollectionEvent>(owner),
                mint_nft_events: account::new_event_handle<MintNFTEvent>(owner),
                burn_nft_events: account::new_event_handle<BurnNFTEvent>(owner)
            });
        }
    }

    // Create a new brand collection
    public entry fun create_collection(
        owner: &signer,
        description: String,
        name: String,
        supply: u64,
        metadata_uri: String,
        price: u64
    ) acquires BrandCollectionManager {
        let owner_addr = signer::address_of(owner);
        assert!(exists<BrandCollectionManager>(owner_addr), E_UNAUTHORIZED);

        let brand_manager = borrow_global_mut<BrandCollectionManager>(owner_addr);
        
        // Remove unused collection_ref
        let collection_ref = &collection::create_unlimited_collection(
            owner,
            description,
            name,
            option::none(),
            metadata_uri
        );

        let collection_info = CollectionInfo {
            creator: owner_addr,
            description,
            supply,
            price,
            metadata_uri,
            total_minted: 0
        };

        smart_table::add(&mut brand_manager.collections, name, collection_info);

        event::emit_event(&mut brand_manager.create_collection_events, CreateCollectionEvent {
            creator: owner_addr,
            collection_name: name,
            description,
            supply
        });
    }

    // Mint an NFT from a specific collection
    public entry fun mint_nft(
        owner: &signer,
        collection_name: String,
        token_name: String,
        to_address: address,
    ) acquires BrandCollectionManager, NftCollection {
        let owner_addr = signer::address_of(owner);
        assert!(exists<BrandCollectionManager>(owner_addr), E_UNAUTHORIZED);

        let brand_manager = borrow_global_mut<BrandCollectionManager>(owner_addr);
        assert!(smart_table::contains(&brand_manager.collections, collection_name), E_COLLECTION_NOT_EXISTS);

        let collection_info = smart_table::borrow_mut(&mut brand_manager.collections, collection_name);
        assert!(collection_info.total_minted < collection_info.supply, E_INSUFFICIENT_SUPPLY);

        let token_ref = &token::create(
            owner,
            collection_name,
            token_name,
            collection_info.description,
            option::none(),
            collection_info.metadata_uri
        );

        // Remove unused token_signer
        let token_object = object::object_from_constructor_ref<token::Token>(token_ref);
        let transfer_ref = object::generate_transfer_ref(token_ref);
        let burn_ref = token::generate_burn_ref(token_ref);

        object::transfer(owner, token_object, to_address);
        
        // move_to(owner, NftCollection {
        //         collection_id: collection_name,
        //         tokens: table::new()
        // });

        // Ensure NftCollection exists before accessing
        // if (!exists<NftCollection>(@alonix5)) {
        //     move_to(owner, NftCollection {
        //         collection_id: collection_name,
        //         tokens: table::new()
        //     });
        // };

        // Store references for later use
        if (collection_info.total_minted < 1){
        let collection_obj = borrow_global_mut<NftCollection>(@alonix5);
        table::add(&mut collection_obj.tokens, token_name, TokenRefs {
            transfer_ref,
            burn_ref
        });
        };

        collection_info.total_minted = collection_info.total_minted + 1;

        event::emit_event(&mut brand_manager.mint_nft_events, MintNFTEvent {
            collection_name,
            token_name,
            minter: owner_addr,
            to_address
        });
    }

    // Burn an NFT
    public entry fun burn_nft(
        owner: &signer,
        collection_name: String,
        token_name: String
    ) acquires BrandCollectionManager, NftCollection {
        let owner_addr = signer::address_of(owner);
        assert!(exists<BrandCollectionManager>(owner_addr), E_UNAUTHORIZED);

        let brand_manager = borrow_global_mut<BrandCollectionManager>(owner_addr);
        assert!(smart_table::contains(&brand_manager.collections, collection_name), E_COLLECTION_NOT_EXISTS);

        let collection_obj = borrow_global_mut<NftCollection>(@alonix5);
        
        // Retrieve and burn token
        if (table::contains(&collection_obj.tokens, token_name)) {
            let TokenRefs { transfer_ref: _, burn_ref } = table::remove(&mut collection_obj.tokens, token_name);
            token::burn(burn_ref);

            event::emit_event(&mut brand_manager.burn_nft_events, BurnNFTEvent {
                collection_name,
                token_name,
                owner: owner_addr
            });
        }
    }

    // Optional: Function to check collection details
    #[view]
    public fun get_collection_info(
        owner_addr: address, 
        collection_name: String
    ): Option<CollectionInfo> acquires BrandCollectionManager {
        if (exists<BrandCollectionManager>(owner_addr)) {
            let brand_manager = borrow_global<BrandCollectionManager>(owner_addr);
            if (smart_table::contains(&brand_manager.collections, collection_name)) {
                return option::some(*smart_table::borrow(&brand_manager.collections, collection_name))
            }
        };
        option::none()
    }
}