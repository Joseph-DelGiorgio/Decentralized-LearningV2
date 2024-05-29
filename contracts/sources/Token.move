module token::Token {
    use sui::object::{Self, ID, UID};
    use sui::tx_context::TxContext;
    use sui::event::emit;
    use sui::balance::{Self, Balance};
    use sui::signer;

    struct Token has key, store {
        id: UID,
        supply: u64,
    }

    struct InitializeEvent has key {
        account: address,
        initial_supply: u64,
    }

    struct MintEvent has key {
        account: address,
        amount: u64,
    }

    struct TransferEvent has key {
        sender: address,
        receiver: address,
        amount: u64,
    }

    struct BurnEvent has key {
        account: address,
        amount: u64,
    }

    // Initialize the supply for the token.
    public entry fun initialize_supply(account: &signer, initial_supply: u64, ctx: &mut TxContext) {
        let id = tx_context::new_id(ctx);
        move_to(account, Token { id, supply: initial_supply });
        emit<InitializeEvent>(InitializeEvent { account: signer::address_of(account), initial_supply });
    }

    // Mint new tokens and add them to the specified account's supply.
    public entry fun mint(account: &signer, amount: u64, ctx: &mut TxContext) {
        let token = borrow_global_mut<Token>(signer::address_of(account));
        token.supply = token.supply + amount;
        emit<MintEvent>(MintEvent { account: signer::address_of(account), amount });
    }

    // Transfer tokens from the sender's account to the receiver's account.
    public entry fun transfer(sender: &signer, receiver: address, amount: u64, ctx: &mut TxContext) {
        let sender_token = borrow_global_mut<Token>(signer::address_of(sender));
        assert!(sender_token.supply >= amount, 1, "Insufficient balance");

        sender_token.supply = sender_token.supply - amount;

        if (!exists<Token>(receiver)) {
            let id = tx_context::new_id(ctx);
            move_to(&signer.borrow(), Token { id, supply: amount });
        } else {
            let receiver_token = borrow_global_mut<Token>(receiver);
            receiver_token.supply = receiver_token.supply + amount;
        }

        emit<TransferEvent>(TransferEvent { sender: signer::address_of(sender), receiver, amount });
    }

    // Burn tokens from the specified account's supply.
    public entry fun burn(account: &signer, amount: u64, ctx: &mut TxContext) {
        let token = borrow_global_mut<Token>(signer::address_of(account));
        assert!(token.supply >= amount, 2, "Insufficient balance to burn");
        token.supply = token.supply - amount;
        emit<BurnEvent>(BurnEvent { account: signer::address_of(account), amount });
    }

    // Returns the balance of tokens for the specified account.
    public fun balance(account: address): u64 {
        if (!exists<Token>(account)) {
            return 0;
        }
        let token = borrow_global<Token>(account);
        token.supply
    }
}
