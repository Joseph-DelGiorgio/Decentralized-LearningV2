module reward_distribution::RewardDistribution {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::balance::{Self, Balance};
    use sui::event::emit;
    use sui::signer::Signer;
    use sui::account::Account;

    use token::Token;

    use ContentManagement::{Content, UploadContentEvent, UpdateContentEvent, DeleteContentEvent};

    struct UserActivity has key, store {
        id: UID,
        completed_modules: u64,
        discussions: u64,
        content_created: u64,
        content_updated: u64,
        content_deleted: u64,
    }

    struct InitializeActivityEvent has key {
        user: address,
    }

    struct RecordActivityEvent has key {
        user: address,
        modules: u64,
        discussions: u64,
        content_created: u64,
        content_updated: u64,
        content_deleted: u64,
    }

    struct DistributeRewardsEvent has key {
        user: address,
        total_rewards: u64,
    }

    // Initialize user activity record.
    public entry fun initialize_activity(user: &signer, ctx: &mut TxContext) {
        let id = tx_context::new_id(ctx);
        move_to(user, UserActivity { 
            id, 
            completed_modules: 0, 
            discussions: 0, 
            content_created: 0, 
            content_updated: 0, 
            content_deleted: 0 
        });
        emit<InitializeActivityEvent>(InitializeActivityEvent { user: signer::address_of(user) });
    }

    // Record user activity.
    public entry fun record_activity(
        user: &signer, 
        modules: u64, 
        discussions: u64, 
        content_created: u64, 
        content_updated: u64, 
        content_deleted: u64, 
        ctx: &mut TxContext
    ) {
        let activity = borrow_global_mut<UserActivity>(signer::address_of(user));
        activity.completed_modules = activity.completed_modules + modules;
        activity.discussions = activity.discussions + discussions;
        activity.content_created = activity.content_created + content_created;
        activity.content_updated = activity.content_updated + content_updated;
        activity.content_deleted = activity.content_deleted + content_deleted;
        emit<RecordActivityEvent>(RecordActivityEvent { 
            user: signer::address_of(user), 
            modules, 
            discussions, 
            content_created, 
            content_updated, 
            content_deleted 
        });
    }

    // Distribute rewards based on recorded activity.
    public entry fun distribute_rewards(user: &signer, ctx: &mut TxContext) {
        let activity = borrow_global_mut<UserActivity>(signer::address_of(user));
        let total_rewards = activity.completed_modules * 10 
                            + activity.discussions * 5 
                            + activity.content_created * 20 
                            + activity.content_updated * 10 
                            + activity.content_deleted * 5;
        Token::mint(user, total_rewards, ctx);
        emit<DistributeRewardsEvent>(DistributeRewardsEvent { user: signer::address_of(user), total_rewards });
    }

    // View user activity details.
    public fun get_activity(user: address): (u64, u64, u64, u64, u64) {
        let activity = borrow_global<UserActivity>(user);
        (
            activity.completed_modules, 
            activity.discussions, 
            activity.content_created, 
            activity.content_updated, 
            activity.content_deleted
        )
    }
}

module reward::AdvancedRewardDistribution {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::event::emit;
    use sui::signer::Signer;
    use sui::account::Account;
    use token::Token;

    struct UserContribution has key, store {
        id: UID,
        content_created: u64,
        discussions_participated: u64,
        modules_completed: u64,
    }

    struct ContributionEvent has key {
        user: address,
        content_created: u64,
        discussions_participated: u64,
        modules_completed: u64,
    }

    struct RewardDistributionEvent has key {
        user: address,
        reward: u64,
    }

    // Record user contribution
    public entry fun record_contribution(user: &signer, content: u64, discussions: u64, modules: u64, ctx: &mut TxContext) {
        let contribution = UserContribution {
            id: tx_context::new_id(ctx),
            content_created: content,
            discussions_participated: discussions,
            modules_completed: modules,
        };
        move_to(user, contribution);
        emit<ContributionEvent>(ContributionEvent { 
            user: signer::address_of(user), 
            content_created: content, 
            discussions_participated: discussions, 
            modules_completed: modules 
        });
    }

    // Distribute rewards based on contributions
    public entry fun distribute_rewards(user: &signer, ctx: &mut TxContext) {
        let contribution = borrow_global<UserContribution>(signer::address_of(user));
        let reward = contribution.content_created * 10 + contribution.discussions_participated * 5 + contribution.modules_completed * 15;
        Token::mint(user, reward, ctx);
        emit<RewardDistributionEvent>(RewardDistributionEvent { user: signer::address_of(user), reward });
    }
}
