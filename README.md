# Language support for BlitzX3D

> I would like to express my sincere condolences on the death of Mark Sibly, the author of Blitz3D. May he Rest In Peace.

This extension provides language support for BlitzX3D and integrates its `blitzcc` compiler.
Standalone parsing and type checking is implemented from the [BlitzX3D source code](https://github.com/krimbopple/BlitzX3D), which is based on the original Blitz3D source released under the zlib/libpng license by Blitz Research Ltd.

> Note: This is a pre-release version. You might experience more bugs than usual. Please help development by reporting bugs and/or making feature requests on the [GitHub repository](https://github.com/Team-X3D/vscode-blitzX3D).

## Release Notes

> To see all the changes, check the [changelog](CHANGELOG.md) or the [GitHub repository](https://github.com/Team-X3D/vscode-blitzX3D).

This build targets BlitzX3D only. It adds:

- `Enum` declarations
- `Do`/`Loop`, `With`, `Switch`, `Is`/`IsNot`, and the other experimental constructs
- BlitzX3D-only parsing and analysis

## Features

The extension provides the following functionalities:

- Syntax highlighting
- Syntax error reporting
- Semantic highlighting
- Some semantic warnings and errors (WIP)
- Basic IntelliSense suggestions
- Document symbols tree
- Signature help
- Usage of the built-in debugger GUI
- Added functionality for documentation
- Ability to set the default file to run in launch.json
- First compile error can be seen on every save
- Command for browsing the builtin code examples
- Basic document formatting

> Note: The extension uses the BlitzX3D `blitzcc` compiler. Runtime error details are not available through the compiler, matching the behaviour of the built-in IDE.

## BBDoc: javadoc-like documentation utilities

BBDoc helps to write code more efficiently with some added keywords, without affecting compatibility.

### Function documentation

The following keywords can be used in lines preceding function definitions:

- `;; ` followed by the documentation of the function
- `;;param ` followed by the name of a parameter and its description
- `;;author ` followed by the author of the function
- `;;return ` followed by the return value of the function
- `;;since ` followed by the version when the function was created
- `;;deprecated`, optionally followed by a reasoning or alternatives

These keywords are interpreted as comments by BlitzX3D, but within vscode they are used to provide information on mouse hover or code completion.

### Type documentation

The following keywords can be used in lines preceding type definitions:

- `;; ` followed by the documentation of the type
- `;;author ` followed by the author of the type
- `;;since ` followed by the version when the type was created

### Manage tasks with TODOS

Use `;;TODO` anywhere in the code to create a link for a task in vscode's problems window. This can be disabled in the extension settings.

### Information interpreted without keywords

Comments following global, local, const or field declarations are interpreted as descriptions, which are shown in code completion windows.

## Extension Settings

Set `blitz3d.installation.BlitzPath` to the root of your BlitzX3D installation. Enable `blitz3d.compilation.ExperimentalSyntax` to pass `-experimental` to `blitzcc` for `Do`/`Loop`, `With`, `Switch`, and the other experimental constructs.

## Known Issues and limitations

- Include files might not be recognized when filename is not explicitly specified
- Multiple open folders are not supported, they might falsely collide with each other
- Information provided on hover might be incorrect if there are more than one objects with the same name (like a function and a type)
- Type checking is limited as of now
