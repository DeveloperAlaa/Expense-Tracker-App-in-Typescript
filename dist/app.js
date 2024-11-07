"use strict";
const form = document.getElementById("form");
const currentMoney = document.getElementById("current-money");
const debitCards = document.querySelector(".cards__debit");
const creditCards = document.querySelector(".cards__credit");
const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const currentBalance = JSON.parse(localStorage.getItem("currentBalance")) || "00.00";
currentMoney.innerText = `$${currentBalance}`;
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const expenseData = new FormData(form);
    const expenseType = String(expenseData.get("expenseType"));
    const description = String(expenseData.get("description"));
    const amount = Number(expenseData.get("amount"));
    expenses.push({
        id: Date.now(),
        expenseType,
        description,
        amount,
    });
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateCurrentBalance(amount, expenseType);
    updateCards();
    form.reset();
});
const updateCurrentBalance = (amount, expenseType) => {
    let currentAmount = Number(currentMoney.innerText.replace("$", ""));
    if (expenseType === "credit") {
        const finalAmount = currentAmount + amount;
        localStorage.setItem("currentBalance", JSON.stringify(finalAmount));
        currentMoney.innerText = `$${finalAmount}`;
    }
    else {
        const finalAmount = currentAmount - amount;
        localStorage.setItem("currentBalance", JSON.stringify(finalAmount));
        currentMoney.innerText = `$${finalAmount}`;
    }
};
const updateCards = () => {
    creditCards.innerHTML = ``;
    debitCards.innerHTML = ``;
    for (let i = 0; i < expenses.length; i++) {
        let expenseItem = expenses[i];
        let container = expenseItem.expenseType === "credit" ? creditCards : debitCards;
        const card = /*html*/ `
                        <div class="card ${expenseItem.expenseType === "credit"
            ? "credit"
            : "debit"}">
                            <div class="card__header">
                            <p class="card__description">${expenseItem.description}</p>
                            <span class="card__remove" onclick="removeCard(${expenseItem.id})">&#10005;</span>
                            </div>
                            <p class="card__amount">$${expenseItem.amount}</p>
                        </div>`;
        container.innerHTML += card;
    }
};
updateCards();
const removeCard = (id) => {
    let expenseItem = expenses.find((expenseItem) => {
        return expenseItem.id === id;
    });
    const index = expenses.indexOf(expenseItem);
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateCards();
    updateCurrentBalance(-expenseItem.amount, expenseItem.expenseType);
};
