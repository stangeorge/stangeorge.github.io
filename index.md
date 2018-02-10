## Learning Go Language by building over a simple example

[Find Environment Variables](#find-environment-variables)  
[Get the variables separately using range](#get-the-variables-separately-using-range)  
[Get both index and values variables separately](#get-both-index-and-values-variables-separately)  
[Ignore index using underscore](#ignore-index-using-underscore)  
[Split the values](#split-the-values)  
[Get only the environment variable names](#get-only-the-environment-variable-names)  
[Call a function](#call-a-function)  
[Concurrency](#concurrency)  
[Have the routines finish before main](#have-the-routines-finish-before-main)  
[Parallel run on multiple CPUs](#parallel-run-on-multiple-cpus)  
[Fibonacci](#fibonacci)

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

>Stanleys-MacBook-Air:learngo stan$ go run learn.go
[TERM_PROGRAM=vscode VIRTUALENVWRAPPER_SCRIPT=/usr/local/bin/virtualenvwrapper.sh VIRTUALENVWRAPPER_PROJECT_FILENAME=.project TERM...]

**Result:** I got all the variables in a single block. Let me try to separate this out.

___

### Get the variables separately using range
**Concepts:** creating an initializing a variable, for-loop, range

    for e := range os.Environ() {
      fmt.Println(e)
    }

>Stanleys-MacBook-Air:learngo stan$ go run learn.go 
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

>Stanleys-MacBook-Air:learngo stan$ go run learn.go
0 TERM_PROGRAM=vscode
1 VIRTUALENVWRAPPER_SCRIPT=/usr/local/bin/virtualenvwrapper.sh

**Result:** I got the index and variables. Let me ignore the index.

___

### Ignore index using underscore
**Concepts:** underscore

    for _, e := range os.Environ() {
      fmt.Println(e)
    }

>Stanleys-MacBook-Air:learngo stan$ go run learn.go>
>
>TERM_PROGRAM=vscode
>
>VIRTUALENVWRAPPER_SCRIPT=/usr/local/bin/virtualenvwrapper.sh

**Result:**I got the variable-value pair. Let me split them out.

___

### Split the values
**Concepts:** strings.Split(), array

    for _, e := range os.Environ() {
      pair := strings.Split(e, "=")
      fmt.Println(pair)
    }

>Stanleys-MacBook-Air:learngo stan$ go run learn.go
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
    
>Stanleys-MacBook-Air:learngo stan$ go run learn.go
>
>TERM_PROGRAM
>
>VIRTUALENVWRAPPER_SCRIPT

**Result:** I got the first element in an array

___

### Call a function
**Concepts:** function, parameters

    func printenviron(e string) {
        time.Sleep(10 * time.Millisecond)
        fmt.Println(e)
    }

    func main() {
        for _, e := range os.Environ() {
            pair := strings.Split(e, "=")
            printenviron(pair[0])
        }
    }

> Stanleys-MacBook-Air:learngo stan$ time go run learn.go
>
>real    0m0.616s
>
>user    0m0.146s
>
>sys     0m0.097s

**Result:** Called a function in a loop. Let me see if I can reduce the execution time

___

### Concurrency
**Concepts:** go routines, channels

    func printenviron(e string, channel chan string) {
        time.Sleep(10 * time.Millisecond)
        fmt.Println(e)
        channel <- e
    }

    func main() {
        channel := make(chan string)
        for _, e := range os.Environ() {
            pair := strings.Split(e, "=")
            go printenviron(pair[0], channel)
        }
        fmt.Println(<-channel) //outside the for-loop
    }

>Stanleys-MacBook-Air:learngo stan$ time go run learn.go
>
>VIRTUALENVWRAPPER_VIRTUALENV
>
>real    0m0.291s
>
>user    0m0.219s
>
>sys     0m0.103s

**Result:** Called a method concurrently many times. They communicate with the main thread using channel and pass it the variable name. Real time for this was 0m0.291s vs 0m0.616s if this was called sequentially in a loop. HOWEVER, this does not mean that all the routines finished before the main thread finished.

___

### Have the routines finish before main
**Concepts:** go routines, channels

    func main() {
        channel := make(chan string)
        for _, e := range os.Environ() {
            pair := strings.Split(e, "=")
            go printenviron(pair[0], channel)
            fmt.Println(<-channel) //inside the for-loop
        }
    }

>Stanleys-MacBook-Air:learngo stan$ time go run learn.go
> 
>TERM_PROGRAM
>
>real    0m0.654s
>
>user    0m0.205s
>
>sys     0m0.109s

**Result:** Moving the "fmt.Println(<-channel)" inside the for-loop makes the main function wait till it gets a response from all the routines. Note that this took around the same 0.654s as the prior sequential run that took 0.616s. Lets see if we can make this run in parallel.

___

### Parallel run on multiple CPUs
**Concepts:** runtime, cores

    func main() {
        runtime.GOMAXPROCS(runtime.NumCPU()) //number of CPUs
        
        channel := make(chan string)
        for _, e := range os.Environ() {
            pair := strings.Split(e, "=")
            go printenviron(pair[0], channel)
            fmt.Println(<-channel)
        }
    }

>Stanleys-MacBook-Air:learngo stan$ time go run learn.go
>
>TERM_PROGRAM
>
>real    0m0.646s
>
>user    0m0.206s
>
sys     0m0.109s

**Results** We set GOMAXPROCS to the max CPUs we have. This did not seem to affect the execution time. It was still around 0.646s vs the sequential 0.616s. So no gain in speed yet.

### Fibonacci
**Concepts:** Recursion, switch-case

    func fibonacci(n int) int {
        switch n {
        case 0: return 0
        case 1: fallthrough
        case 2: return 1
        default:
            return fibonacci(n-1) + fibonacci(n-2)
        }
    }
    func main() {
    	fmt.Println(fibonacci(40))
    }

**Results** Recursion in action
>Stanleys-MacBook-Air:learngo stan$ time go run learn.go
>
>102334155
>
>real    0m0.927s
>
>user    0m0.846s
>
>sys     0m0.115s
> Stanleys-MacBook-Air:learngo stan$
