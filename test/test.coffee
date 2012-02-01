FnHash = require '../lib'

describe 'Primitive', ->
  fnHash = new FnHash

  fnHash.add 'A', '1'
  fnHash.add 'B', '2'
  fnHash.add 'C', '3'

  describe '#get "A"', ->
    it 'should return "1"', ->
      fnHash.get('A').should.equal '1'

  describe '#get "C"', ->
    it 'should return "3"', ->
      fnHash.get('C').should.equal '3'

describe 'Functional', ->
  fnHash = new FnHash

  fnHash.add 'A', '1'
  fnHash.add /^.$/, '2'
  fnHash.add 'C', '3'
  fnHash.add 'DE', '4'
  fnHash.add ((input) ->
      if input < 20 then 'less than 20' else undefined),
    (input, result) -> result
  fnHash.add /[a-z]+/, (input, result) -> result
  fnHash.add /[0-9]+/, (input, result) -> input

  describe '#get "A"', ->
    it 'should return "1"', ->
      fnHash.get('A').should.equal '1'

  describe '#get "C"', ->
    it 'should return "2"', ->
      fnHash.get('C').should.equal '2'

  describe '#get "30"', ->
    it 'should return "30"', ->
      fnHash.get('30').should.equal '30'

  describe '#get "abc"', ->
    it 'should return a regexp result', ->
      obj = ['abc']
      obj.index = 0
      obj.input = 'abc'
      fnHash.get('abc').should.eql obj

  describe '#get "15"', ->
    it 'should return "less than 20"', ->
      fnHash.get('15').should.equal 'less than 20'
