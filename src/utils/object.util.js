'use strict';

const _ = require('lodash');

// filter data with specificed fields
const getInfoData = ({ fields = [], object = {} }) => {
    // object = []
    if( Array.isArray( object )) return object.map(item => _.pick(item, fields)); 

    // object = {}
    return _.pick(object, fields)
}

function groupCoursesByClass(courses, key) {
    // Tạo một object tạm để nhóm các khóa học theo courseClass
    const grouped = courses.reduce((acc, course) => {        
        // Nếu chưa có courseClass này, tạo mới
        if (!acc[course[key]]) {
            acc[course[key]] = [];
        }
        
        // Thêm khóa học vào mảng tương ứng
        acc[course[key]].push({
            ...course
        });
        
        return acc;
    }, {});
    
    // Chuyển object thành mảng theo định dạng yêu cầu
    return Object.keys(grouped).map(courseClass => ({
        [key]: parseInt(courseClass),
        courses: grouped[courseClass]
    }));
}

module.exports = {
    getInfoData, groupCoursesByClass
}