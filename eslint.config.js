import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  typescript: true,
  imports: true,
}).overrideRules({
  'node/prefer-global/process': 'off',
  'unicorn/throw-new-error': 'off',
})
