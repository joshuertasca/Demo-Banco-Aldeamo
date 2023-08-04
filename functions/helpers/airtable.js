require('dotenv').config();
var Airtable = require('airtable');
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
var base2 = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID2);
const table = base(process.env.AIRTABLE_TABLE_NAME);
const table2 = base2(process.env.AIRTABLE_TABLE_NAME2);
const table3 = base2(process.env.AIRTABLE_TABLE_NAME3);

module.exports = { table, table2, table3};

