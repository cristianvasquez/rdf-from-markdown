import dataset from '@rdfjs/dataset'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { createTriplifier } from '../index.js'
import ns from '../src/namespaces.js'
import { expect } from 'expect'
import { markdownToRDF } from '../src/markdown-to-RDF.js'
import toMatchSnapshot from 'expect-mocha-snapshot'
import rdf from '../src/rdf-ext.js'
import { createTermMapper } from '../src/termMapper/defaultTermMapper.js'
import { prettyPrint } from './support/serialization.js'
import {
  allTests, splitOnTags, splitOnIdentifiers, splitOnHeaders, yamlLike,
} from './tests.js'

expect.extend({ toMatchSnapshot })

const context = {
  termMapper: createTermMapper({
    baseNamespace: rdf.namespace('http://my-vault.org/'),
    documentUri: ns.ex.document,
  }),
  path: 'file.md',
  pointer: rdf.clownface({ dataset: rdf.dataset(), term: ns.ex.file }),
}

const dir = 'test/markdown'
const triplifier = await createTriplifier(dir, {
  baseNamespace: ns.ex,
})

describe('triplify examples', async function () {

  for (const file of triplifier.vault.getFiles()) {
    it(file, async function () {

      const text = await readFile(resolve(dir, file), 'utf8')
      const pointer = triplifier.toRDF(text, { path: file },
        { addLabels: true, includeWikiPaths: true, splitOnHeader: true })

      const pretty = await prettyPrint(pointer.dataset)
      expect(pretty).toMatchSnapshot(this)
    })
  }
})


