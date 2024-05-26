module DataIntegration {
    use 0x1::Chainlink;

    struct MarketData has key {
        data: vector<u8>,
    }

    public fun update_market_data(account: &signer, data: vector<u8>) {
        move_to(account, MarketData { data });
    }

    public fun get_market_data(): vector<u8> {
        let data = borrow_global<MarketData>(Signer::address_of(&0x1));
        data.data
    }
}
