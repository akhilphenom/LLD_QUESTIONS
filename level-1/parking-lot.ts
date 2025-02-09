/**
 * ParkingLot - ParkingSpot[]
 * ParkingSpot - { compact, mini, large }
 * Entrance terminal
 * Exit terminal
 * AssignTicket and reserve spot
 * CollectTicket and release
 * CalculateHourlyRate - { rate for { mini, compact, large } }
 * PaymentProcessor at exit
 */

const generateUniqueId = () => {
    return new Date().toString()
}

enum ParkingSpotType {
    MINI,
    COMPACT,
    LARGE
}

interface ParkingSpot {
    _id: string;
    type: ParkingSpotType;
    reserved: boolean;
}

class MiniParkingSpot implements ParkingSpot {
    _id: string;
    reserved: boolean;
    type: ParkingSpotType = ParkingSpotType.MINI;
    
    constructor() { 
        this._id = generateUniqueId() 
        this.reserved = false
    }
}
class CompactParkingSpot implements ParkingSpot {
    _id: string;
    reserved: boolean;
    type: ParkingSpotType = ParkingSpotType.MINI;
    
    constructor() { 
        this._id = generateUniqueId() 
        this.reserved = false
    }
}
class LargeParkingSpot implements ParkingSpot {
    _id: string;
    reserved: boolean;
    type: ParkingSpotType = ParkingSpotType.MINI;
    
    constructor() { 
        this._id = generateUniqueId() 
        this.reserved = false
    }
}

class ParkingLot {
    static instance: ParkingLot;
    public capacity: number;
    private parkingSpots: ParkingSpot[];
    public entryTerminals: EntryTerminal[];
    public exitTerminals: ExitTerminal[];

    private constructor(capacity: number, terminals: number) {
        this.capacity = capacity;
        this.parkingSpots = [
            ...[].constructor(capacity/3).map(_ => new MiniParkingSpot()),
            ...[].constructor(capacity/3).map(_ => new CompactParkingSpot()),
            ...[].constructor(capacity/3).map(_ => new LargeParkingSpot()),
        ];
        this.entryTerminals = [].constructor(terminals).map(_ => new EntryTerminal()) 
        this.exitTerminals = [].constructor(terminals).map(_ => new ExitTerminal()) 
    }

    public static getInstance() {
        if(!this.instance) {
            return this.instance = new ParkingLot(99, 4);
        }
        return this.instance;
    }

    public getFreeParkingSpots () {
        return this.parkingSpots.filter(parkingSpot => !parkingSpot.reserved)
    }

    public releaseParkingSpot ({ _id }: ParkingSpot) {
        const parkingSpot = this.parkingSpots.find(({ _id: parkingSpotId }) => _id == parkingSpotId);
        parkingSpot!.reserved = false
    }
}

class ParkingTicket {
    _id: string;
    issueTime: Date;
    parkingSpot: ParkingSpot
    
    constructor(parkingSpot: ParkingSpot) {
        this._id = generateUniqueId();
        this.issueTime = new Date();
        this.parkingSpot = parkingSpot;
    }
}

abstract class Terminal {
    protected _id: string
    getId () {};
}

class EntryTerminal extends Terminal {
    private _parkingStrategy: ParkingStrategy = new RandomParkingStrategy();

    constructor() {
        super();
        this._id = generateUniqueId()
    }
    
    getId(): (string){
        return this._id;
    }
    public createTicket(parkingSpotType: ParkingSpotType): ParkingTicket {
        const parkingSpot = this._parkingStrategy.assignParkingSpot(parkingSpotType)!;
        return new ParkingTicket(parkingSpot);
    }
}

class ExitTerminal extends Terminal {
    private _parkingStrategy: ParkingStrategy = new ParkingStrategy();

    constructor() {
        super();
        this._id = generateUniqueId()
    }

    getId(): (string){
        return this._id;
    }
    public releaseTicket(ticket: ParkingTicket) {
        this._parkingStrategy.releaseParkingSpot(ticket);
    }
    public processPayment (paymentService: PaymentProcessorService) {
        paymentService.processPayment();
    }
}

class ParkingStrategy {
    protected _parkingLot: ParkingLot = ParkingLot.getInstance();
    assignParkingSpot (parkingSpotType: ParkingSpotType): ParkingSpot | null {
        return null;
    }
    releaseParkingSpot (ticket: ParkingTicket) {
        const { parkingSpot }  = ticket;
        this._parkingLot.releaseParkingSpot(parkingSpot)
    }
}

class RandomParkingStrategy extends ParkingStrategy {
    assignParkingSpot(parkingSpotType: ParkingSpotType): ParkingSpot {
        const parkingSpots = this._parkingLot.getFreeParkingSpots();
        return parkingSpots.find(({ type }) => type == parkingSpotType)!
    }
}

class PaymentProcessorService {
    calculatePrice (ticket: ParkingTicket) {
        const time = ticket.issueTime
        // moment
        return 50;
    }
    processPayment () {}
}

class CashPaymentService extends PaymentProcessorService {
    processPayment(): boolean {
        return true;
    }
}
class CardPaymentService extends PaymentProcessorService {
    processPayment(): boolean {
        return true;
    }
}

const parkingLot = ParkingLot.getInstance();
const parkingSpotType = ParkingSpotType.MINI;
const entryTerminal = parkingLot.entryTerminals[0];
const ticket = entryTerminal.createTicket(parkingSpotType)
parkingLot.exitTerminals[3].processPayment(new CashPaymentService())
parkingLot.exitTerminals[3].releaseTicket(ticket)