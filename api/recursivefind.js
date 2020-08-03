var path = require('path')
var fs = require('fs')

function recFindByExt(base,ext,files,videos) 
{
    files = files || fs.readdirSync(base) 
    videos = videos || []

    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            if ( fs.statSync(newbase).isDirectory() )
            {
                videos = recFindByExt(newbase,ext,fs.readdirSync(newbase),videos)
            }
            else
            {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext )
                {
		    videos.push({
			    filename: file,
			    rootPath: rootPath,
			    basePath: base,
			    fullPath: newbase

		    })
                } 
            }
        }
    )
    return videos
}

const fileExtensions  = [
	'avi',
	'mpg',
	'mpeg',
	'mp4',
	'm4v',
	'mkv',
	'mov',
	'wmv',
]

const rootPath = '/media/video/TV/ReBoot/'

ext_file_list = recFindByExt(rootPath,'mp4')

console.dir(ext_file_list)

