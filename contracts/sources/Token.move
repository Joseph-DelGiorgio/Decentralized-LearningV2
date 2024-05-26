module Token {
    struct Token has key {
        supply: u64,
    }

    public fun initialize_supply(account: &signer, initial_supply: u64) {
        move_to(account, Token { supply: initial_supply });
    }

    public fun mint(account: &signer, amount: u64) {
        let token = borrow_global_mut<Token>(Signer::address_of(account));
        token.supply = token.supply + amount;
    }

    public fun transfer(sender: &signer, receiver: address, amount: u64) {
        let token = borrow_global_mut<Token>(Signer::address_of(sender));
        assert!(token.supply >= amount, 1);
        token.supply = token.supply - amount;
        let receiver_token = borrow_global_mut<Token>(receiver);
        receiver_token.supply = receiver_token.supply + amount;
    }

    public fun burn(account: &signer, amount: u64) {
        let token = borrow_global_mut<Token>(Signer::address_of(account));
        assert!(token.supply >= amount, 2);
        token.supply = token.supply - amount;
    }
}
