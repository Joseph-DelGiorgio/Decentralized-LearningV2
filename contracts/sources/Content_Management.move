module ContentManagement {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::event::emit;
    use sui::signer::Signer;
    use sui::account::Account;

    use reward_distribution::RewardDistribution;

    struct Content has key, store {
        id: UID,
        data: vector<u8>,
        creator: address,
    }

    struct UploadContentEvent has key {
        creator: address,
        content_id: ID,
    }

    struct UpdateContentEvent has key {
        updater: address,
        content_id: ID,
    }

    struct DeleteContentEvent has key {
        deleter: address,
        content_id: ID,
    }

    // Upload content function
    public entry fun upload_content(account: &signer, data: vector<u8>, ctx: &mut TxContext) {
        let content_id = tx_context::new_id(ctx);
        let content = Content { id: content_id, data, creator: signer::address_of(account) };
        move_to(account, content);

        // Update user activity for content creation
        RewardDistribution::record_activity(account, 0, 0, 1, 0, 0, ctx);

        // Emit event for content upload
        emit<UploadContentEvent>(UploadContentEvent { creator: signer::address_of(account), content_id: content_id.id });
    }

    // Get content data by ID
    public fun get_content(id: ID): vector<u8> {
        let content = borrow_global<Content>(id);
        content.data
    }

    // Get content creator by ID
    public fun get_creator(id: ID): address {
        let content = borrow_global<Content>(id);
        content.creator
    }

    // Update content function
    public entry fun update_content(account: &signer, id: ID, new_data: vector<u8>, ctx: &mut TxContext) {
        let content = borrow_global_mut<Content>(id);
        assert!(content.creator == signer::address_of(account), "Only the creator can update the content");
        content.data = new_data;

        // Record activity for content update
        RewardDistribution::record_activity(account, 0, 0, 0, 1, 0, ctx);

        // Emit event for content update
        emit<UpdateContentEvent>(UpdateContentEvent { updater: signer::address_of(account), content_id: id });
    }

    // Delete content function
    public entry fun delete_content(account: &signer, id: ID, ctx: &mut TxContext) {
        let content = borrow_global<Content>(id);
        assert!(content.creator == signer::address_of(account), "Only the creator can delete the content");

        // Remove the content
        let _ = move_from<Content>(id);

        // Record activity for content deletion
        RewardDistribution::record_activity(account, 0, 0, 0, 0, 1, ctx);

        // Emit event for content deletion
        emit<DeleteContentEvent>(DeleteContentEvent { deleter: signer::address_of(account), content_id: id });
    }

    // Search content by creator
    public fun get_content_by_creator(creator: address): vector<ID> {
        // This function would require indexing support to be efficient, which is outside the basic scope of this example.
        // Here is a conceptual approach assuming we have such indexing capability.
        let contents = vector::empty<ID>();

        // Assuming we have a way to iterate through all contents
        for_each_content(|content: &Content| {
            if (content.creator == creator) {
                vector::push_back(&mut contents, content.id.id);
            }
        });

        contents
    }

    // Placeholder for iterating all contents (not practical in real implementations without indexing)
    fun for_each_content<F: Fn(&Content)>(f: F) {
        // Pseudo implementation to iterate over all content.
        // Real implementation would require proper storage and indexing solutions.
    }
}


module content::ContentValidation {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::event::emit;
    use sui::signer::Signer;

    struct ContentRating has key, store {
        id: UID,
        content_id: ID,
        rating: u64,
        num_ratings: u64,
    }

    struct RateContentEvent has key {
        rater: address,
        content_id: ID,
        rating: u64,
    }

    // Rate content
    public entry fun rate_content(account: &signer, content_id: ID, rating: u64, ctx: &mut TxContext) {
        let content_rating = borrow_global_mut<ContentRating>(content_id);
        content_rating.rating = (content_rating.rating * content_rating.num_ratings + rating) / (content_rating.num_ratings + 1);
        content_rating.num_ratings = content_rating.num_ratings + 1;
        emit<RateContentEvent>(RateContentEvent { rater: signer::address_of(account), content_id, rating });
    }

    // Get content rating
    public fun get_content_rating(content_id: ID): u64 {
        let content_rating = borrow_global<ContentRating>(content_id);
        content_rating.rating
    }
}
