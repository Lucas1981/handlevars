# Parser

So, this is a Node program that will string replace custom html elements with
templates stored in handlebars files with values that you can pass. So for instance,
if in an html file a line like this occurs:

`<my-component name="James" />`

That will be replaced with the rendered contents of a my-component.handlebars file, like:

`<p>Hello, {{ name }}! Nice to meet you!</p>`

Finally resulting in:

`<p>Hello, James! Nice to meet you!</p>`

The program will map unknown html tags directly to corresponding .handlebars files
with the same name.

## JSONs

You can pass a JSON by prefixing the attribute's name with a colon. So

`<my-component :names="[ \"John\", \"Jack\" ]" >`

with a template

`{{#each names}}<p>{{this}}</p>{{/each}}`

Will be translated into:

`<p>John</p><p>Jack</p>`

## Wishlist

In a very elementary form, this now works. What I would like to be able to add though, is:

- Slots. You can only specify self-closing html tags right now. It would be nice to have some custom content
be carried along.
- Recursive rendering. Right now the rendering is rather flat. If you would put a custom component in
a custom component, that would not render right now. Would be nice to make it recursive.
- Differentiate between the single and double quotes. It would be good to seek out the end with which it
starts to give use more flexibility.
