/* jshint esversion: 6 */

const elementRegEx = new RegExp(/<.*?>/, 'sg');
const excludedElements = [ '!DOCTYPE', 'html', 'title', 'head', 'body', 'link', 'meta', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'div', 'span', 'input', 'button', 'table', 'tr', 'td', 'br', 'hr' ];
const Handlebars = require('handlebars');
const fs = require('fs');

class Parser {
  constructor() {
  }

  static renderAllTags(content) {
    let tags = Parser.getAllTags(content);

    for(let tagIndex in tags) {
      let tag = tags[tagIndex];
      console.log(tag);
      let component = String(fs.readFileSync(`./src/components/${tag.key}.handlebars`));
      let template = Handlebars.compile(component);
      let rendition = template(tag.attributes);
      content = content.replace(tag.tagRaw, rendition);
    }

    return content;
  }

  static getAllTags(text) {
    let tagsRaw = text.match(elementRegEx);
    let tags = [];
    for(let tagIndex in tagsRaw) {
      let tagRaw = tagsRaw[tagIndex];
      let tag = tagsRaw[tagIndex].replace(/\n/g, ' '); // Prune out the newlines
      let attributes = {};
      // The name has to be the part of the string starting from the opening '<'
      // up to the first space
      let index = tag.search(/(\s|>)/);
      let name = tag.substr(1, index - 1);

      if(excludedElements.indexOf(name) != -1 || name.charAt(0) == '/') continue;

      // Next, progress until we run into the next viable character
      while(tag.substr(index).indexOf('=') != -1) {

        // Seek the next non-whitespace character
        while( tag.charAt(index).match(/\s/) ) {
          index++;
        }

        // We found the next attribute, so mark it and search for the next '='
        let attributeStart = index;

        while(!tag.charAt(index).match('=')) {
          index++;
        }

        // We found the end of the attribute name. Store it and move on to the value.
        let attribute = tag.substring(attributeStart, index);

        // Move past the initial '="' characters. Could do with error handling later
        index += 2;

        // Seek the closing quotation mark
        let valueStart = index;
        let foundValue = false;
        while(!foundValue) {
          if(tag.charAt(index) == '"' && !Parser.isEscaped(tag, index)) {
            foundValue = true;
          }
          else {
            index++;
          }
        }

        // Get the value
        let value = tag.substring(valueStart, index);

        // Commit key/value pair to the attributes
        if(attribute.charAt(0) == ':' ) {
          attribute = attribute.substr(1);
          attributes[attribute] = JSON.parse( value.replace(/\\/g, '') );
        }
        else {
          attributes[attribute] = value;
        }

        // Move to the next character
        index++;

      }

      // Commit the tag and its attributes
      tags.push({
        key: name,
        tagRaw,
        attributes
      });
    }
    return tags;
  }

  static isEscaped(string, start) {
    let index = start - 1;
    let isEscaped = false;
    while(string.charAt(index) == '\\' && index > 0) {
      isEscaped = !isEscaped;
      index--;
    }
    return isEscaped;
  }
}

module.exports = Parser;
