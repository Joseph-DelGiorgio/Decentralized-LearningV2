module UserManagement {
    struct User has key {
        id: u64,
        name: vector<u8>,
        tokens: u64,
    }

    public fun register_user(account: &signer, id: u64, name: vector<u8>) {
        move_to(account, User { id, name, tokens: 0 });
    }

    public fun get_user_info(account: &signer): (u64, vector<u8>, u64) {
        let user = borrow_global<User>(Signer::address_of(account));
        (user.id, user.name, user.tokens)
    }
}
