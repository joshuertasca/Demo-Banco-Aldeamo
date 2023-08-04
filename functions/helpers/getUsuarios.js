const { table, table2, table3 } = require('./airtable');
const formattedReturn = require('./formattedReturn');

module.exports = async (event, tabla) => {

    if (tabla == 1) {
        try {
            const courses = await table.select().firstPage();
            const formattedCourses = courses.map((course) => ({
                id: course.id,
                ...course.fields,
            }));
            return formattedReturn(200, formattedCourses);
        } catch (err) {
            console.error(err);
            return formattedReturn(500, { msg: 'Something went wrong' });
        }
    } else if (tabla == 2) {
        try {
            const courses = await table2.select().firstPage();
            const formattedCourses = courses.map((course) => ({
                id: course.id,
                ...course.fields,
            }));
            return formattedReturn(200, formattedCourses);
        } catch (err) {
            console.error(err);
            return formattedReturn(500, { msg: 'Something went wrong' });
        }
    } else if (tabla == 3) {
        try {
            const courses = await table3.select().firstPage();
            const formattedCourses = courses.map((course) => ({
                id: course.id,
                ...course.fields,
            }));
            return formattedReturn(200, formattedCourses);
        } catch (err) {
            console.error(err);
            return formattedReturn(500, { msg: 'Something went wrong' });
        }
    }






};
