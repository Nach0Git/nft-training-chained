# Chained Smart Contract

Create .env file and complete it with your values from metamask

```sh
cp .env.sample .env
```

To compile the contract

```sh
npx hardhat compile
```

To start localhost network run the following (network will live in the terminal session, when closing it the network will be destroyed)
```sh
npx hardhat node
```

To deploy to localhost
```shell
npx hardhat run scripts/deploy.js --network localhost
```

To generate a nft
```shell
npx hardhat --network localhost generate {selectedAddress} 
```

To add a student by task
```shell
npx hardhat --network localhost addStudent {selectedAddress} 
```

To grade a student by task
```shell
npx hardhat --network localhost gradeStudent {selectedAddress} {grade} {subject}
```

samples:
- npx hardhat --network localhost addStudent 0xbcd4042de499d14e55001ccbb24a551f3b954096
- npx hardhat --network localhost gradeStudent 0xbcd4042de499d14e55001ccbb24a551f3b954096 8 Programming