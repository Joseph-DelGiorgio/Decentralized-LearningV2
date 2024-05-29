module staking::TokenStaking {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::event::emit;
    use sui::signer::Signer;

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
        let staker_id = tx_context::new_id(ctx);
        let staker = Staker {
            id: staker_id,
            staked_amount: amount,
            reward_amount: 0,
        };
        move_to(account, staker);
        emit<StakeEvent>(StakeEvent { staker: signer::address_of(account), amount });
    }

    // Unstake tokens
    public entry fun unstake_tokens(account: &signer, ctx: &mut TxContext) {
        let staker = borrow_global_mut<Staker>(signer::address_of(account));
        let amount = staker.staked_amount;
        staker.staked_amount = 0;
        move_from<Staker>(staker.id);
        emit<UnstakeEvent>(UnstakeEvent { staker: signer::address_of(account), amount });
    }

    // Claim staking rewards
    public entry fun claim_reward(account: &signer, ctx: &mut TxContext) {
        let staker = borrow_global_mut<Staker>(signer::address_of(account));
        let reward = staker.reward_amount;
        staker.reward_amount = 0;
        emit<ClaimRewardEvent>(ClaimRewardEvent { staker: signer::address_of(account), reward });
    }
}
