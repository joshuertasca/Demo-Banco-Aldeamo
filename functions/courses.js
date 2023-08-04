const formattedReturn = require('./helpers/formattedReturn');
const getCourses = require('./helpers/getUsuarios');
const createCourse = require('./helpers/enviarObjeto');
const { HttpStatusCode } = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod === 'GET' ) {
        if (event.headers.token==process.env.REACT_APP_PASSWORD) {

            if (event.headers.table==1) {
                return await getCourses(event,1);
            } else if (event.headers.table==2) {
                return await getCourses(event,2);
            } else if (event.headers.table==3) {
                return await getCourses(event,3);
            }

            
        }else{
            return await formattedReturn(401, { message: 'Unauthorized' });
        }
    } else if (event.httpMethod === 'POST') {
        if (event.headers.token==process.env.REACT_APP_PASSWORD) {
            return await createCourse(event);
        }else{
            return await formattedReturn(401, { message: 'Unauthorized' });
        }
        
    } else {
        return formattedReturn(405, {});
    }
};
