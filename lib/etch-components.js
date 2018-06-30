class StatefulComponent {

  constructor (lyPaths) {
    this.lyPaths = lyPaths
    this.counter = 0
    this.fileNames = []
    this.lyPaths.forEach( lyPath => {
      fileName = path.basename(lyPath)
      this.fileNames.push(fileName)
    })
    this.render_order_string = this.fileNames.join("\n")
    etch.initialize(this)
  }

  render () {
    return (
      <div>
      <h1 align="right">LILYFORMALIST</h1>
      <h3 align="right">version 0.0.0</h3>
      <div>
        <button onclick={() => this.writeFile()}>
          Render Score
        </button>
      </div>
      <div>
      <span>{this.render_order_string}</span>
      </div>
      </div>
    )
  }

  update () {}

  writeFile () {

    //concatenate lilypond file names into lilypond file
    the_string =
`
\\version "2.19.81"
\\language "english"

{
`

    this.lyPaths.forEach( (ly_path) => {
      the_string = the_string + "\n\t\\include " + "\""+ ly_path + "\""
    })

    the_string += "\n}"

    //write the string to a temporary file
    const tmpScoreFilepath = tempWrite.sync(the_string, "test.ly")

    //copy .ly files to the tmp directory
    tmp_dir = path.dirname(tmpScoreFilepath)

    this.lyPaths.forEach( ly_path => {
      var ly_file_name = path.basename(ly_path)
      var destination = path.join(tmp_dir, ly_file_name)
      fs.copyFileSync(ly_path, destination)
    })
    //render the temporary file using lilycompile
    lilyFormalistPlugin.lilycompile.compile(tmpScoreFilepath)
  }
}

export default StatefulComponent
