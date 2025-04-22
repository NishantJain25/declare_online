class Player {
	constructor(player) {
		this.id = player.id;
		this.name = player.username;
		this.cardsInHand = new Deck([]);
	}

	playCard(cards) {
		this.cardsInHand.remove(cards);
	}

	receiveCard(card) {
		this.cardsInHand.add(card);
	}

	get totalScore() {
		return this.cardsInHand.reduce((total, card) => {
			total = total + CARD_VALUE_MAP[card.slice(0, -1)];
		}, 0);
	}
}
