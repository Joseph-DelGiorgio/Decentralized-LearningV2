module ContentManagement {
    struct Content has key {
        id: u64,
        data: vector<u8>,
    }

    public fun upload_content(account: &signer, id: u64, data: vector<u8>) {
        move_to(account, Content { id, data });
    }

    public fun get_content(id: u64): vector<u8> {
        let content = borrow_global<Content>(id);
        content.data
    }
}
