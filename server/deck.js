const CARD_VALUES = [
	"A",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"J",
	"Q",
	"K",
];
const CARD_SUITS = ["♠", "♦", "♣", "♥"];

const CARD_VALUE_MAP = {
	A: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	10: 10,
	J: 10,
	Q: 10,
	K: 10,
};

class Deck {
	constructor(cards = this.newDeck()) {
		this.cards = cards;
	}

	get length() {
		return this.cards.length;
	}

	newDeck() {
		const cards = CARD_VALUES.flatMap((val) => {
			return CARD_SUITS.map((suit) => val + suit);
		});
		return cards;
	}

	shuffleDeck() {
		for (let i = this.length - 1; i >= 0; i--) {
			const oldCard = this.cards[i];
			const newIndex = Math.floor(Math.random() * i);
			const newCard = this.cards[newIndex];
			this.cards[newIndex] = oldCard;
			this.cards[i] = newCard;
		}
	}

	add(card) {
		this.cards.unshift(card);
	}

	pop() {
		return this.cards.shift();
	}

	slice(start, end){
		return this.cards.slice(start, end)
	}


	remove(cardsToRemove) {
		const toRemove = Array.isArray(cardsToRemove) ? cardsToRemove : [cardsToRemove]
		console.log({toRemove})
		this.cards = this.cards.filter(
			(card) => !toRemove.includes(card)
		);
	}
}

module.exports = {Deck, CARD_VALUE_MAP}