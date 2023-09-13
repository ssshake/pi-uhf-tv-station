var path = require('path')
var fs = require('fs').promises

async function getVideosInFolder(base,files,videos) 
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


    files = files || await fs.readdir(base) 
    videos = videos || []

    for(file of files){
            var newbase = path.join(base,file)
            const foo = await fs.stat(newbase)
	    if ( foo.isDirectory() )
            {
		const dir = await fs.readdir(newbase)
                videos = await getVideosInFolder(newbase,dir,videos)
            }
            else
            {
		const extension = file.substr( -1 * ( 3 ) )
                if ( fileExtensions.includes(extension))
                {
		    videos.push({
			    name: file,
			    filename: file,
			    basePath: base,
			    fullPath: newbase

		    })
                } 
            }
    }
    return videos.sort((a,b) => (a.name > b.name) ? 1 : -1 )
}

module.exports = {
	getVideosInFolder
}
