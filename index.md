## Learning Go Language by building over a simple example

[Find Environment Variables](#find-environment-variables)  
[Get the variables separately using range](#get-the-variables-separately-using-range)  
[Get both index and values variables separately](#get-both-index-and-values-variables-separately)  
[Ignore index using underscore](#ignore-index-using-underscrore)  
[Split the values by =](#split-the-values-by-=)  
[Get only the environment variable names](#get-only-the-environment-variable-names)  

### Find Environment Variables
**Concepts:** package, imports, main function, printing a line, running a go program.

    package main

    import (
      "fmt"
      "os"
    )

    func main() {
      fmt.Println(os.Environ())
    }

>Stanleys-MacBook-Air:crypto stan$ go run crypto.go
[TERM_PROGRAM=vscode VIRTUALENVWRAPPER_SCRIPT=/usr/local/bin/virtualenvwrapper.sh VIRTUALENVWRAPPER_PROJECT_FILENAME=.project TERM...]

**Result:** I got all the variables in a single block. Let me try to separate this out.

___

### Get the variables separately using range
**Concepts:** creating an initializing a variable, for-loop, range

    for e := range os.Environ() {
      fmt.Println(e)
    }

>Stanleys-MacBook-Air:crypto stan$ go run crypto.go 
>
>0
>
>1

**Result:** I got only the index values. Let me get the variables.

___

### Get both index and values variables separately
**Concepts:** indexes and values in a for-loop

    for i, e := range os.Environ() {
      fmt.Println(i, e)
    }

>Stanleys-MacBook-Air:crypto stan$ go run crypto.go
0 TERM_PROGRAM=vscode
1 VIRTUALENVWRAPPER_SCRIPT=/usr/local/bin/virtualenvwrapper.sh

**Result:** I got the index and variables. Let me ignore the index.

___

### Ignore index using underscore
**Concepts:** underscore

    for _, e := range os.Environ() {
      fmt.Println(e)
    }

>Stanleys-MacBook-Air:crypto stan$ go run crypto.go>
>
>TERM_PROGRAM=vscode
>
>VIRTUALENVWRAPPER_SCRIPT=/usr/local/bin/virtualenvwrapper.sh

**Result:**I got the variable-value pair. Let me split them out.

___

### Split the values by =
**Concepts:** strings.Split(), array

    for _, e := range os.Environ() {
      pair := strings.Split(e, "=")
      fmt.Println(pair)
    }

>Stanleys-MacBook-Air:crypto stan$ go run crypto.go
>
>[TERM_PROGRAM vscode]
>
>[VIRTUALENVWRAPPER_SCRIPT /usr/local/bin/virtualenvwrapper.sh]

**Result:** I split the values and got arrays

___

### Get only the environment variable names
**Concepts:** array

    for _, e := range os.Environ() {
      pair := strings.Split(e, "=")
      fmt.Println(pair[0])
    }
    
>Stanleys-MacBook-Air:crypto stan$ go run crypto.go
>
>TERM_PROGRAM
>
>VIRTUALENVWRAPPER_SCRIPT

**Result:** I got the first element in an array

___
