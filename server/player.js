const { Deck, CARD_VALUE_MAP } = require("./deck");

class Player {
	constructor(player) {
		this.id = player.id;
		this.name = player.username;
		this.cardsInHand = null;
		this.totalScore = 0
	}

	setCards(cards) {
		this.cardsInHand = new Deck(cards)
		
	}

	playCards(cards,nullCard) {
		this.cardsInHand.remove(cards);
		this.updateScore(nullCard)
	}

	receiveCard(card) {
		this.cardsInHand.add(card);
	}

	updateScore(nullCard) {
		const score = this.cardsInHand.cards.reduce((total, card) => {
			return total + (card === nullCard ? 0 : CARD_VALUE_MAP[card.slice(0, -1)]);
		}, 0);

		this.totalScore = score
	}

	get score(){
		return this.totalScore
	}
}
module.exports = {Player}