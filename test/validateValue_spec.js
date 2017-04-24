import validateValue from '../src/validateValue';
import validate from '../src/validate';
import collectionOf from '../src/collectionOf';

describe('validateValue', () => {
  const value = 'Iva';
  const schema = {
    required: true,
    minLength: 4,
    string: true,
  };

  it('should validate object by schema', () => {
    expect(validateValue(value, schema)).to.deep.equal({
      minLength: 4,
    });
    expect(validateValue(null, schema)).to.deep.equal({
      required: true,
      minLength: 4,
      string: true,
    });
  });
  it('should return null if value is valid by schema', () => {
    expect(validateValue('ivan', schema)).to.deep.equal(null);
  });
  it('should not return error if valid is not passed and not it is not required ', () => {
    expect(validateValue(null, {
      minLength: 4,
    })).to.deep.equal({
      minLength: 4
    });
  });

  it('should throw an error if validator is not defined', () => {
    expect(() => validateValue(null, {
      someNewValidator: true,
    })).to.throw;
  });
  it('it should return an error for not uniqueKey', () => {
    const schema = {
      documents: collectionOf({
        id: {
          required: true,
        },
      }, {
        uniqueKey: 'id',
      }),
    };
    expect(validate({
      documents: [
        {
          id: '123',
          description: 'ajsd haksjdha kj',
        },
        {
          id: '123',
          description: 'aoidhas lkasd',
        }
      ],
    }, schema)).to.deep.equal({
      documents: {
        uniqueKey: 'id',
      },
    });

    expect(validate({
      documents: [
        {
          id: '123',
        },
        {
          id: '124',
        }
      ],
    }, schema)).to.deep.equal({});

    expect(validate({
      documents: ['123', '124'],
    }, {
      documents: {
        uniqueKey: true,
      }
    })).to.deep.equal({});
  });
});
