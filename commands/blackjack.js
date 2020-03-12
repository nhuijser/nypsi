const { RichEmbed } = require("discord.js")
const { userExists, createUser, getBalance, updateBalance, formatBet } = require("../utils.js")
const shuffle = require("shuffle-array")

const cooldown = new Map()
const games = new Map()

module.exports = {
    name: "blackjack",
    description: "play blackjack",
    category: "money",
    run: async (message, args) => {

        if (!message.guild.me.hasPermission("EMBED_LINKS")) {
            return message.channel.send("❌ \ni am lacking permission: 'EMBED_LINKS'");
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send("❌ \ni am lacking permission: 'MANAGE_MESSAGES'");
        }

        if (!userExists(message.member)) createUser(message.member)

        if (games.has(message.member.user.id)) {
            return message.channel.send("❌\nyou are already playing blackjack")
        }

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 30 - diff

            const minutes = Math.floor(time / 60)
            const seconds = time - minutes * 60

            let remaining

            if (minutes != 0) {
                remaining = `${minutes}m${seconds}s`
            } else {
                remaining = `${seconds}s`
            }
            return message.channel.send("❌\nstill on cooldown for " + remaining );
        }

        if (!args[0]) {
            return message.channel.send("❌\n$blackjack <bet>")
        }

        if (args[0] == "all") {
            args[0] = getBalance(message.member)
        }

        if (args[0] == "half") {
            args[0] = getBalance(message.member) / 2
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            if (!isNaN(formatBet(args[0]) || !parseInt(formatBet[args[0]]))) {
                args[0] = formatBet(args[0])
            } else {
                return message.channel.send("❌\n$blackjack <bet>")
            }
        }

        const bet = (parseInt(args[0]));

        if (bet == 0) {
            return message.channel.send("❌\n$blackjack <bet>")
        }

        if (bet > getBalance(message.member)) {
            return message.channel.send("❌\nyou cannot afford this bet")
        }

        cooldown.set(message.member.id, new Date())

        setTimeout(() => {
            cooldown.delete(message.member.id)
        }, 30000)

        updateBalance(message.member, getBalance(message.member) - bet)

        const id = Math.random()

        const newDeck = ["A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", 
            "A♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "10♣", "J♣", "Q♣", "K♣", 
            "A♥️", "2♥️", "3♥️", "4♥️", "5♥️", "6♥️", "7♥️", "8♥️", "9♥️", "10♥️", "J♥️", "Q♥️", "K♥️",
            "A♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "10♦", "J♦", "Q♦", "K♦"]
    
        games.set(message.member.user.id, {
            bet: bet,
            deck: shuffle(newDeck),
            cards: [],
            dealerCards: [],
            id: id,
            first: true
        })

        setTimeout(() => {
            if (games.has(message.member.user.id) && games.get(message.member.user.id).id == id) {
                games.delete(message.member.user.id)
                return message.channel.send(message.member + " blackjack expired")
            }
        }, 120000)

        newDealerCard(message.member)
        newCard(message.member)
        newDealerCard(message.member)
        newCard(message.member)

        let color;

        if (message.member.displayHexColor == "#000000") {
            color = "#FC4040";
        } else {
            color = message.member.displayHexColor;
        }

        const embed = new RichEmbed()
            .setTitle("blackjack")
            .setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString())
            .setColor(color)
            .addField("dealer", games.get(message.member.user.id).dealerCards[0])
            .addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
            .addField("help", ":one: hit | :two: stand")
            .setFooter(message.member.user.tag + " | bot.tekoh.wtf", message.member.user.avatarURL)
            .setTimestamp();

        message.channel.send(embed).then(m => {
            return playGame(message, m)
        }).catch()
    }
}

function newCard(member) {
    const bet = games.get(member.user.id).bet
    const deck = games.get(member.user.id).deck
    const cards = games.get(member.user.id).cards
    const dealerCards = games.get(member.user.id).dealerCards
    const id = games.get(member.user.id).id
    const first = games.get(member.user.id).first

    const choice = deck[Math.floor(Math.random() * deck.length)]

    deck.splice(deck.indexOf(choice), 1)
    cards.push(choice)

    games.set(member.user.id, {
        bet: bet,
        deck: deck,
        cards: cards,
        dealerCards: dealerCards,
        id: id,
        first: first
    })
}

function newDealerCard(member) {
    const bet = games.get(member.user.id).bet
    const deck = games.get(member.user.id).deck
    const cards = games.get(member.user.id).cards
    const dealerCards = games.get(member.user.id).dealerCards
    const id = games.get(member.user.id).id
    const first = games.get(member.user.id).first

    const choice = deck[Math.floor(Math.random() * deck.length)]

    deck.splice(deck.indexOf(choice), 1)
    dealerCards.push(choice)

    games.set(member.user.id, {
        bet: bet,
        deck: deck,
        cards: cards,
        dealerCards: dealerCards,
        id: id,
        first: first
    })
}

function calcTotal(member) {
    const cards = games.get(member.user.id).cards

    let total = 0
    let aces = 0

    let aceAs11 = false

    for (card of cards) {
        card = card.split("♠").join().split("♣").join().split("♥️").join().split("♦").join()
        
        if (card.includes("K") || card.includes("Q") || card.includes("J")) {
            total = total + 10
        } else if (card.includes("A")) {
            aces++
        } else {
            total = total + parseInt(card)
        }
    }

    if (aces > 0) {
        for (let i = 0; i < aces; i++) {
            if (aces > 1) {
                total = total + 1
            } else {
                if (total <= 10) {
                    total = total + 11
                    aceAs11 = true
                } else {
                    total = total + 1
                }
            }
        }
    }

    if (total > 21) {
        if (aceAs11) {
            total = total - 10
        }
    }

    return total
}

function calcTotalDealer(member) {
    const cards = games.get(member.user.id).dealerCards

    let total = 0
    let aces = 0

    let aceAs11 = false

    for (card of cards) {
        card = card.split("♠").join().split("♣").join().split("♥️").join().split("♦").join()
        
        if (card.includes("K") || card.includes("Q") || card.includes("J")) {
            total = total + 10
        } else if (card.includes("A")) {
            aces++
        } else {
            total = total + parseInt(card)
        }
    }

    if (aces > 0) {
        for (let i = 0; i < aces; i++) {
            if (aces > 1) {
                total = total + 1
            } else {
                if (total <= 10) {
                    total = total + 11
                    aceAs11 = true
                } else {
                    total = total + 1
                }
            }
        }
    }

    if (total > 21) {
        if (aceAs11) {
            total = total - 10
        }
    }

    return total
}

function getCards(member) {
    const cards = games.get(member.user.id).cards

    let message = ""
    
    for (card of cards) {
        message = message + "| " + card + " "
    }

    return message.substr(1)
}

function getDealerCards(member) {
    const cards = games.get(member.user.id).dealerCards

    let message = ""
    
    for (card of cards) {
        message = message + "| " + card + " "
    }

    return message.substr(1)
}

async function playGame(message, m) {

    const bet = games.get(message.member.user.id).bet
    const first = games.get(message.member.user.id).first

    let color;

    if (message.member.displayHexColor == "#000000") {
        color = "#FC4040";
    } else {
        color = message.member.displayHexColor;
    }

    const newEmbed = new RichEmbed()
        .setTitle("blackjack")
        .setColor(color)
        .setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString())
        .setFooter(message.member.user.tag + " | bot.tekoh.wtf", message.member.user.avatarURL)
        .setTimestamp();

    if (calcTotalDealer(message.member) > 21 && !first) {
        newEmbed.setColor("#31E862")
        newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**winner!!**\n**you win** $" + (bet * 2).toLocaleString())
        newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
        newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
        updateBalance(message.member, getBalance(message.member) + (bet * 2))
        return setTimeout(() => {
            games.delete(message.member.user.id)
            m.clearReactions()
            m.edit(newEmbed)
        }, 1000)
    }

    if (calcTotalDealer(message.member) == 21 || calcTotal(message.member) > 21 || games.get(message.member.user.id).dealerCards.length == 5 && !first) {

        if (calcTotal(message.member) == calcTotalDealer(message.member) && games.get(message.member.user.id).dealerCards.length != 5 && games.get(message.member.user.id).cards.length != 5) {
            newEmbed.setColor("#E5FF00")
            newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**draw!!**\nyou win $" + bet.toLocaleString())
            newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
            newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
            updateBalance(message.member, getBalance(message.member) + bet)
            return setTimeout(() => {
                games.delete(message.member.user.id)
                m.clearReactions()
                m.edit(newEmbed)
            }, 1000)
        }

        newEmbed.setColor("#FF0000")
        newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**you lose!!**")
        newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
        newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
        return setTimeout(() => {
            games.delete(message.member.user.id)
            m.clearReactions()
            m.edit(newEmbed)
        }, 1000)
    } else if (calcTotal(message.member) == 21 || games.get(message.member.user.id).cards.length == 5 && !first) {
        newEmbed.setColor("#31E862")
        newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**winner!!**\n**you win** $" + (bet * 2).toLocaleString())
        newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
        newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
        updateBalance(message.member, getBalance(message.member) + (bet * 2))
        return setTimeout(() => {
            games.delete(message.member.user.id)
            m.clearReactions()
            m.edit(newEmbed)
        }, 1000)
    } else {
        await m.react("1️⃣").then(() => m.react("2️⃣"))
        games.set(message.member.user.id, {
            bet: bet,
            deck: games.get(message.member.user.id).deck,
            cards: games.get(message.member.user.id).cards,
            dealerCards: games.get(message.member.user.id).dealerCards,
            id: games.get(message.member.user.id).id,
            first: false
        })

        const filter = (reaction, user) => {
            return ["1️⃣", "2️⃣"].includes(reaction.emoji.name) && user.id == message.member.user.id
        }
    
        const reaction = await m.awaitReactions(filter, { max: 1, time: 240000, errors: ["time"] })
            .then(collected => {
                return collected.first().emoji.name
            }).catch(() => {
            })

        if (reaction == "1️⃣") {
            newCard(message.member)

            if (calcTotalDealer(message.member) == 21 || calcTotal(message.member) > 21) {
                newEmbed.setColor("#FF0000")
                newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**you lose!!**")
                newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                games.delete(message.member.user.id)
                m.clearReactions()
                return m.edit(newEmbed)
            } else if (calcTotal(message.member) == 21) {
                newEmbed.setColor("#31E862")
                newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**winner!!**\n**you win** $" + (bet * 2).toLocaleString())
                newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                updateBalance(message.member, getBalance(message.member) + (bet * 2))
                games.delete(message.member.user.id)
                m.clearReactions()
                return m.edit(newEmbed)
            }

            newEmbed.addField("dealer", games.get(message.member.user.id).dealerCards[0])
            newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
            
            m.edit(newEmbed)

            m.reactions.get(reaction).remove(message.member.user.id)

            return playGame(message, m)

        } else if (reaction == "2️⃣") {
            m.reactions.get(reaction).remove(message.member.user.id)

            
            const newEmbed1 = new RichEmbed()
                .setTitle("blackjack")
                .setColor(color)
                .setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString())
                .addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                .addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                .setFooter(message.member.user.tag + " | bot.tekoh.wtf", message.member.user.avatarURL)
                .setTimestamp();
            m.edit(newEmbed1)
            
            setTimeout(() => {
                dealerPlay(message)

                if (calcTotal(message.member) == calcTotalDealer(message.member)) {
                    newEmbed.setColor("##E5FF00")
                    newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**draw!!**\nyou win $" + bet.toLocaleString())
                    newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                    newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                    updateBalance(message.member, getBalance(message.member) + bet)
                    return setTimeout(() => {
                        games.delete(message.member.user.id)
                        m.clearReactions()
                        m.edit(newEmbed)
                    }, 1000)
                }
    
                if (calcTotalDealer(message.member) > 21) {
                    newEmbed.setColor("#31E862")
                    newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**winner!!**\n**you win** $" + (bet * 2).toLocaleString())
                    newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                    newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                    updateBalance(message.member, getBalance(message.member) + (bet * 2))
                    games.delete(message.member.user.id)
                    m.clearReactions()
                    return m.edit(newEmbed)
                }
            
                if (calcTotalDealer(message.member) == 21 || calcTotal(message.member) > 21 || games.get(message.member.user.id).dealerCards.length == 5) {
                    newEmbed.setColor("#FF0000")
                    newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**you lose!!**")
                    newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                    newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                    games.delete(message.member.user.id)
                    m.clearReactions()
                    return m.edit(newEmbed)
                } else if (calcTotal(message.member) == 21 || games.get(message.member.user.id).cards.length == 5) {
                    newEmbed.setColor("#31E862")
                    newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**winner!!**\n**you win** $" + (bet * 2).toLocaleString())
                    newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                    newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                    updateBalance(message.member, getBalance(message.member) + (bet * 2))
                    games.delete(message.member.user.id)
                    m.clearReactions()
                    return m.edit(newEmbed)
                } else {
                    if (calcTotal(message.member) > calcTotalDealer(message.member)) {
                        newEmbed.setColor("#31E862")
                        newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**winner!!**\n**you win** $" + (bet * 2).toLocaleString())
                        newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                        newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                        updateBalance(message.member, getBalance(message.member) + (bet * 2))
                        games.delete(message.member.user.id)
                        m.clearReactions()
                        return m.edit(newEmbed)
                    } else {
                        newEmbed.setColor("#FF0000")
                        newEmbed.setDescription(message.member + "\n\n**bet** $" + bet.toLocaleString() + "\n\n**you lose!!**")
                        newEmbed.addField("dealer", getDealerCards(message.member) + " **" + calcTotalDealer(message.member) + "**")
                        newEmbed.addField(message.member.user.tag, getCards(message.member) + " **" + calcTotal(message.member) + "**")
                        games.delete(message.member.user.id)
                        m.clearReactions()
                        return m.edit(newEmbed)
                    }
                }
            }, 1000)

        } else {
            games.delete(message.member.user.id)
            return message.channel.send(message.member + " error: invalid emoji")
        }
    }
}

function dealerPlay(message) {

    if (calcTotalDealer(message.member) >= 16) {
        return
    }

    while (calcTotalDealer(message.member) < 16 && games.get(message.member.user.id).dealerCards.length < 5 && calcTotalDealer(message.member) < calcTotal(message.member) && calcTotalDealer(message.member) < 21) {
        newDealerCard(message.member)
    }
    return 
}