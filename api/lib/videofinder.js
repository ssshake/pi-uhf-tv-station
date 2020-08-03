var path = require('path')
var fs = require('fs')

function getVideosInFolder(base,files,videos) 
{

	const fileExtensions  = [
		'avi',
		'mpg',
		'mp4',
		'm4v',
		'mkv',
		'mov',
		'wmv',
	]


    files = files || fs.readdirSync(base) 
    videos = videos || []

    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            if ( fs.statSync(newbase).isDirectory() )
            {
                videos = recFindByExt(newbase,fs.readdirSync(newbase),videos)
            }
            else
            {
		const extension = file.substr( -1 * ( 3 ) )

                if ( fileExtensions.includes(extension))
                {
		    videos.push({
			    filename: file,
			    basePath: base,
			    fullPath: newbase

		    })
                } 
            }
        }
    )
    return videos
}

module.exports = {
	getVideosInFolder
}
