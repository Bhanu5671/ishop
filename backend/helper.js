function generateFileName(original_name) {
    return (new Date().getTime()) + "-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + original_name;

}

export {generateFileName}