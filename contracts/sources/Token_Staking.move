module staking::TokenStaking {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::event::emit;
    use sui::signer::Signer;

    use token::Token;

    struct Staker has key, store {
        id: UID,
        staked_amount: u64,
        reward_amount: u64,
    }

    struct StakeEvent has key {
        staker: address,
        amount: u64,
    }

    struct UnstakeEvent has key {
        staker: address,
        amount: u64,
    }

    struct ClaimRewardEvent has key {
        staker: address,
        reward: u64,
    }

    // Stake tokens
    public entry fun stake_tokens(account: &signer, amount: u64, ctx: &mut TxContext) {
        // Transfer tokens from the staker to the staking contract
        Token::transfer(account, @staking::TokenStaking, amount, ctx);
        
        // Initialize staker's record if it does not exist
        if (!exists<Staker>(signer::address_of(account))) {
            let staker_id = tx_context::new_id(ctx);
            move_to(account, Staker {
                id: staker_id,
                staked_amount: amount,
                reward_amount: 0,
            });
        } else {
            // Update existing staker's record
            let staker = borrow_global_mut<Staker>(signer::address_of(account));
            staker.staked_amount = staker.staked_amount + amount;
        }

        emit<StakeEvent>(StakeEvent { staker: signer::address_of(account), amount });
    }

    // Unstake tokens
    public entry fun unstake_tokens(account: &signer, amount: u64, ctx: &mut TxContext) {
        let staker = borrow_global_mut<Staker>(signer::address_of(account));
        assert!(staker.staked_amount >= amount, 3, "Insufficient staked amount");

        staker.staked_amount = staker.staked_amount - amount;

        // Transfer tokens back to the staker
        Token::transfer(&@staking::TokenStaking, signer::address_of(account), amount, ctx);

        emit<UnstakeEvent>(UnstakeEvent { staker: signer::address_of(account), amount });
    }

    // Claim staking rewards
    public entry fun claim_reward(account: &signer, ctx: &mut TxContext) {
        let staker = borrow_global_mut<Staker>(signer::address_of(account));
        let reward = staker.reward_amount;
        assert!(reward > 0, 4, "No rewards to claim");

        staker.reward_amount = 0;

        // Mint reward tokens for the staker
        Token::mint(account, reward, ctx);

        emit<ClaimRewardEvent>(ClaimRewardEvent { staker: signer::address_of(account), reward });
    }

    // View staker's details
    public fun get_staker_details(staker: address): (u64, u64) {
        if (!exists<Staker>(staker)) {
            return (0, 0);
        }
        let staker = borrow_global<Staker>(staker);
        (staker.staked_amount, staker.reward_amount)
    }
}
