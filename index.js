const fs 				= require(`fs`),
			util			= require(`util`),
			showdown  = require(`showdown`),
			converter = new showdown.Converter();

const commonmark = require('commonmark');
			reader = new commonmark.Parser();
			writer = new commonmark.HtmlRenderer();

let indexPage = ``;

const config = {
	markdownFile: `./markdown/README.md`,
	filenameForMarkdownHtml: `main.html`,
	index: `./docs/index.html`,
	components: [
		`components/header.html`,
		`components/main.html`,
		`components/footer.html`
	],
};

const writeHtml = (html) => {
	const { filenameForMarkdownHtml } = config;
	fs.writeFile(`components/${filenameForMarkdownHtml}`, html, function(err, data) {
	  if (err) console.log(err);
	  console.log(`transpiling md to html.`);
	  createIndexPage();
	});
}

const readMarkdown = new Promise((resolve, reject) => {
	const { markdownFile } = config;
	fs.readFile(markdownFile, (err, data) => {
		console.log(`getting md file`);
		const parsed = reader.parse(data.toString());
		const result = writer.render(parsed);
		resolve(result);
	})
});

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', function (error, data) {
      if (error) return reject(error);
      indexPage += data;
      console.log(`pasting ${fileName}`);
      resolve();
    })
  });
}

async function createIndexPage() {
	const { components, index } = config;
	await readFile(components[0]);
	await readFile(components[1]);
	await readFile(components[2]);
	await fs.writeFile(index, indexPage, (err, data) => {
	  if (err) console.log(err);
	  console.log(`wrote index page`);
	})
}

Promise.all([readMarkdown])
	.then(res => writeHtml(res));
