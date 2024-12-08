import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import fs from 'fs';


// Connect to the Solana mainnet
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Replace this with your mnemonic phrase
const mnemonic = 'Seed Phrase';

// Derivation path for Solana
const derivationPath = "m/44'/501'/0'/0'"; // Standard path for Solana

// Function to derive a keypair from a mnemonic
function deriveKeypairFromMnemonic(mnemonic, index) {
    const seed = mnemonicToSeedSync(mnemonic); // Convert mnemonic to seed
    const { key } = derivePath(`${derivationPath}/${index}`, seed.toString('hex')); // Derive keypair
    return Keypair.fromSeed(key); // Create Keypair from derived key
}

const tries = 10;

async function getAccount() {
    for (let i = 0; i < tries; i++) {
        const keypair = deriveKeypairFromMnemonic(mnemonic, i);
        const publicKey = keypair.publicKey.toString();
        console.log(`Derived Address: ${publicKey}`);

        // Get the balance of the derived address
        const balance = await connection.getBalance(keypair.publicKey);
        const content = `${publicKey}\n${balance / LAMPORTS_PER_SOL} SOL\n`;
        fs.appendFile('address.txt', content, (err) => {
            if (err) {
                console.error(err);
            }
        });

        // Replace this with your actual Solana address to check
        if (publicKey === 'Wallet Address') {
            console.log(`Address: ${publicKey}`);
            console.log(`Private Key: ${keypair.secretKey}`);
        }
    }
}

getAccount();