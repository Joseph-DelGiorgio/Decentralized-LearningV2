module UserManagement {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::signer::Signer;
    use sui::event::emit;

    use reward_distribution::RewardDistribution;

    struct User has key, store {
        id: UID,
        name: vector<u8>,
        tokens: u64,
        registered_at: u64,
    }

    struct RegisterUserEvent has key {
        user_id: ID,
        name: vector<u8>,
    }

    struct UpdateUserNameEvent has key {
        user_id: ID,
        old_name: vector<u8>,
        new_name: vector<u8>,
    }

    struct AddTokensEvent has key {
        user_id: ID,
        amount: u64,
    }

    struct RemoveTokensEvent has key {
        user_id: ID,
        amount: u64,
    }

    // Register a new user.
    public entry fun register_user(account: &signer, name: vector<u8>, ctx: &mut TxContext) {
        let user_id = tx_context::new_id(ctx);
        let registered_at = tx_context::timestamp(ctx);
        let user = User { id: user_id, name: name.clone(), tokens: 0, registered_at };
        move_to(account, user);

        emit<RegisterUserEvent>(RegisterUserEvent { user_id: user_id.id, name });
    }

    // Get user information.
    public fun get_user_info(account: &signer): (ID, vector<u8>, u64, u64) {
        let user = borrow_global<User>(Signer::address_of(account));
        (user.id.id, user.name, user.tokens, user.registered_at)
    }

    // Update user name.
    public entry fun update_user_name(account: &signer, new_name: vector<u8>, ctx: &mut TxContext) {
        let user = borrow_global_mut<User>(Signer::address_of(account));
        let old_name = user.name.clone();
        user.name = new_name.clone();

        emit<UpdateUserNameEvent>(UpdateUserNameEvent { user_id: user.id.id, old_name, new_name });
    }

    // Add tokens to user's account.
    public entry fun add_tokens(account: &signer, amount: u64, ctx: &mut TxContext) {
        let user = borrow_global_mut<User>(Signer::address_of(account));
        user.tokens = user.tokens + amount;

        emit<AddTokensEvent>(AddTokensEvent { user_id: user.id.id, amount });
    }

    // Remove tokens from user's account.
    public entry fun remove_tokens(account: &signer, amount: u64, ctx: &mut TxContext) {
        let user = borrow_global_mut<User>(Signer::address_of(account));
        assert!(user.tokens >= amount, "Insufficient tokens");
        user.tokens = user.tokens - amount;

        emit<RemoveTokensEvent>(RemoveTokensEvent { user_id: user.id.id, amount });
    }

    // Function to handle user rewards.
    public entry fun distribute_rewards(account: &signer, ctx: &mut TxContext) {
        RewardDistribution::distribute_rewards(account, ctx);
    }
}

