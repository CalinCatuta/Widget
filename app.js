class Widget{
    constructor(){
        this._moneyNeded = Storage.getMoneyNeded()
        this._donations = Storage.getDonations()
        this._displayMoneyNeded()
        this._displayCaloriesProgress()
      
    }

    addDonation(donatie){
        this._donations.push(donatie)
        Storage.saveDonation(donatie)
        this._displayMoneyNeded()
        this._displayCaloriesProgress()

    }

    _displayMoneyNeded(){
        const moneyNededEl = document.querySelector('.neded')
        // reduce(total va fi 0 la prima rulare setat de noi  si se va aduna cu meal.calories.)
        // total va primi valoarea calcului iar daca vor fi mai multe meal total va fi rezultatul anterior a calcului. 0 + 100 = 100. daca sunt 2 mese 100 + a doua masa = ...
        const moneyNeded = this._donations.reduce((total,donatie) => total - donatie.money, 365)
        if(moneyNeded <= 0){
            const btn = document.querySelector('button')
            btn.disabled = true
            moneyNededEl.innerHTML = 'The found is completed'
        }else{
            moneyNededEl.innerHTML = '$' + moneyNeded
        }
    }
    _displayCaloriesProgress(){
        const progresEl = document.querySelector("#calorie-progress")
        const totalMoney = this._donations.reduce((total,donatie) => total + donatie.money, 0)
        
        const percentage = (totalMoney / this._moneyNeded) * 30
        const width = Math.min(percentage, 30)
        progresEl.style.width = `${70 + width}% `
    }
}

class Donate{
    constructor(money){
        this.id = Math.random().toString(16).slice(2)
        this.money = money
    }
}

class Storage{
    static getMoneyNeded(defaulte = 365){
        let moneyNeded
        if(localStorage.getItem('moneyNeded') === null){
            moneyNeded = defaulte
        }else{
            moneyNeded = +localStorage.getItem('moneyNeded')
        }
        return moneyNeded
    }

    static setMoneyNeded(moneyNeded){
        localStorage.setItem('moneyNeded', moneyNeded)
    }

    static getDonations(){
        let donatii
        if(localStorage.getItem('donatii') === null){
            donatii = []
        }else{
            donatii = JSON.parse(localStorage.getItem('donatii'))
        }
        return donatii
    }
    static saveDonation(donatie){
        const donatii = Storage.getDonations()
        donatii.push(donatie)
        localStorage.setItem('donatii', JSON.stringify(donatii))
    }
}

class App{
    constructor(){
        this._widget = new Widget()
        document.querySelector('form')
        .addEventListener('submit', this._addNewDonation.bind(this))
    }

    _addNewDonation(e){
        e.preventDefault()

        const bani = document.querySelector('.donate')

        if(bani.value === ''){
            alert('You need to put a value if you want to donate.')
            return
        }

        const banili = new Donate(+bani.value)
        
        this._widget.addDonation(banili)

        bani.value = ''
    }
}

const app = new App()

