/**
 * Product, Inventory, Payment Processor, State Management
 */
interface IProduct {
    id: string;
    name: string;
    price: number;
}
class Product implements IProduct {
    constructor(
        public id: string,
        public name: string,
        public price: number
    ) {}
}
class Inventory {
    private stock: Map<string, { product: Product; quantity: number }> = new Map();

    addProduct(product: Product, quantity: number = 1) {
        if (this.stock.has(product.id)) {
            this.stock.get(product.id)!.quantity += quantity;
        } else {
            this.stock.set(product.id, { product, quantity });
        }
    }

    isAvailable(productId: string): boolean {
        return this.stock.has(productId) && this.stock.get(productId)!.quantity > 0;
    }

    removeProduct(productId: string): Product | null {
        if (this.isAvailable(productId)) {
            this.stock.get(productId)!.quantity--;
            return this.stock.get(productId)!.product;
        }
        return null;
    }
}
class PaymentProcessor {
    public static validateAmount(amount: number): boolean {
        return Number.isSafeInteger(amount) && amount > 0;
    }
}

enum State {
    IDLE,
    INSERT_COIN,
    PRESS_BUTTON,
    DISPENSED,
}

interface MachineState {
    insertCoin(amount: number): void;
    selectProduct(productId: string): void;
    pressButton(): void;
    dispenseItem(): void;
}

// 🟢 Idle State
class IdleState implements MachineState {
    constructor(private machine: Machine) {}

    insertCoin(amount: number): void {
        if (PaymentProcessor.validateAmount(amount)) {
            console.log(`💰 Inserted $${amount}`);
            this.machine.insertedMoney = amount;
            this.machine.setState(new CoinInsertedState(this.machine));
        } else {
            console.warn("Invalid coin amount.");
        }
    }

    selectProduct(): void {
        console.warn("Insert a coin first.");
    }

    pressButton(): void {
        console.warn("Insert a coin and select a product first.");
    }

    dispenseItem(): void {
        console.warn("Insert a coin and select a product first.");
    }
}

// 🟡 Coin Inserted State
class CoinInsertedState implements MachineState {
    constructor(private machine: Machine) {}

    insertCoin(): void {
        console.warn("Coin already inserted. Select a product.");
    }

    selectProduct(productId: string): void {
        if (this.machine.inventory.isAvailable(productId)) {
            console.log(`✅ Product ${productId} selected.`);
            this.machine.selectedProduct = productId;
            this.machine.setState(new PressButtonState(this.machine));
        } else {
            console.warn("Product not available.");
        }
    }

    pressButton(): void {
        console.warn("Select a product first.");
    }

    dispenseItem(): void {
        console.warn("Select a product and press the button.");
    }
}

// 🟠 Press Button State
class PressButtonState implements MachineState {
    constructor(private machine: Machine) {}

    insertCoin(): void {
        console.warn("Payment already made. Press the button to dispense.");
    }

    selectProduct(): void {
        console.warn("Product already selected. Press the button.");
    }

    pressButton(): void {
        console.log("🛒 Button pressed. Dispensing product...");
        this.machine.setState(new DispenseState(this.machine));
    }

    dispenseItem(): void {
        console.warn("Press the button to confirm.");
    }
}

// 🔴 Dispense State
class DispenseState implements MachineState {
    constructor(private machine: Machine) {}

    insertCoin(): void {
        console.warn("Dispensing in progress. Please wait.");
    }

    selectProduct(): void {
        console.warn("Cannot select a product while dispensing.");
    }

    pressButton(): void {
        console.warn("Product is being dispensed.");
    }

    dispenseItem(): void {
        const product = this.machine.inventory.removeProduct(this.machine.selectedProduct!);
        if (product) {
            console.log(`✅ Dispensed: ${product.name} 🥤`);
            this.machine.insertedMoney = 0;
            this.machine.selectedProduct = null;
            this.machine.setState(new IdleState(this.machine));
        } else {
            console.warn("Error dispensing product.");
            this.machine.setState(new IdleState(this.machine));
        }
    }
}

class Machine {
    private state: MachineState;
    public inventory: Inventory;
    public insertedMoney: number;
    public selectedProduct: string | null;

    constructor() {
        this.state = new IdleState(this);
        this.inventory = new Inventory();
        this.insertedMoney = 0;
        this.selectedProduct = null;
    }

    setState(state: MachineState) {
        this.state = state;
    }

    insertCoin(amount: number) {
        this.state.insertCoin(amount);
    }

    selectProduct(productId: string) {
        this.state.selectProduct(productId);
    }

    pressButton() {
        this.state.pressButton();
    }

    dispenseItem() {
        this.state.dispenseItem();
    }
}

const vendingMachine = new Machine();

const coke = new Product("1", "Coke", 25);
const chips = new Product("2", "Chips", 15);
vendingMachine.inventory.addProduct(coke, 5);
vendingMachine.inventory.addProduct(chips, 3);

vendingMachine.insertCoin(25);     // Insert money
vendingMachine.selectProduct("1"); // Select Coke
vendingMachine.pressButton();      // Confirm
vendingMachine.dispenseItem();     // Get the product

