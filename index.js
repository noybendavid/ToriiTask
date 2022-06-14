require('dotenv').config()
const axios = require('axios')
const dayjs = require('dayjs')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const airtable = require('airtable')
const { URL, BASE_ID, API_KEY, INTERVAL_TIME } = process.env
const base = new airtable({ apiKey: API_KEY }).base(BASE_ID)
const array = []
let btc
dayjs.extend(localizedFormat)

setInterval(() => {
	getData()
	if (array.length !== 0) {
		array.map((item) => updateTable(item))
	} else {
		createRecord()
	}
}, INTERVAL_TIME)

const getData = async () => {
	try {
		const response = await axios.get(`${URL}`)
		btc = response?.data?.USD?.last
	} catch (error) {
		console.log(error.response)
	}
}

const createRecord = () => {
	base('BTC Table').create(
		[
			{
				fields: {
					Time: dayjs().format('lll'),
					Rates: btc
				}
			}
		],
		(err) => {
			if (err) {
				console.error(err)
				let item = {
					Time: time,
					Rates: btc
				}
				array.push(item)
			}
		}
	)
}

const updateTable = (item) => {
	base('BTC Table').create(
		[
			{
				fields: {
					Time: item.Time,
					Rates: item.Rates
				}
			}
		],
		(err) => {
			if (err) console.error(err)
			else array.shift()
		}
	)
}
