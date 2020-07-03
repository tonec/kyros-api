module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTest.js'],
  moduleFileExtensions: ['css', 'scss', 'js', 'json', 'jsx'],
  testEnvironment: 'node',
  testRegex: '/src/.*\\.test\\.js$',
  transformIgnorePatterns: ['/node_modules/(?!test-component).+\\.js$'],
  moduleDirectories: ['src', 'node_modules'],
}
