module.exports = {
  extends: [
    'stylelint-config-recommended-vue',
    'stylelint-config-standard'
  ],
  // customSyntax: 'postcss-less',
  rules: {
    'indentation': 2,
    // 'selector-list-comma-newline-after': null,
    'comment-empty-line-before': null,
    'rule-empty-line-before': null,
    // 'color-function-notation': 'legacy',
    // 'declaration-block-single-line-max-declarations': 5,
    'no-descending-specificity': null, //  去掉禁止特异性较低的选择器在特异性较高的选择器之后重写
    'declaration-colon-space-after': 'always', // :后必须有空格
    'block-opening-brace-space-before': 'always', // {前必须要有空格
    'import-notation': 'string', // 为@import规则指定字符串或URL符号
  }
}