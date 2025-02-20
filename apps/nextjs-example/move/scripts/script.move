script {
    use aptos_framework::aptos_account;

    fun main(caller: &signer, receiver: address, amount: u64) {
        aptos_account::transfer(caller, receiver, amount);
    }
}