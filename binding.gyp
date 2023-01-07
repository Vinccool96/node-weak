{
  'targets': [{
    'target_name': 'weakref',
    'sources': [ 'lib/weakref.cc' ],
    'include_dirs': [
      '<!(node -e "require(\'nan\')")'
    ]
  }]
}
