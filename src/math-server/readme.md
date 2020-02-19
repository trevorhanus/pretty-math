# Symbolic Math Server

This module contains a python server which handles requests to perform symbolic math.

## Running locally

1. Start the server

    ```sh
    python3 local.py
    ```

1. Test it out using a curl command

    ```sh
    curl -X POST -d '{"operation":"derivative","expr":"x**2", "variables":["x"], "wrt":["x"]}' -H 'Content-Type: application/json' http://localhost:5000/
    ```

    ```sh
    curl -X POST -d '{"operation":"integral","expr":"x**2", "variables":["x"], "wrt":["x"]}' -H 'Content-Type: application/json' http://localhost:5000/
    ```

    ```sh
    curl -X POST -d '{"operation":"solveFor", "expr":"x**2 = exp(y)", "variables":["x","y"], "target_var":["x"]}' -H 'Content-Type: application/json' http://localhost:5000/
    ```

    ```sh
    curl -X POST -d '{"operation":"expandExpr", "expr":"(x+1)**2", "variables":["x"]}' -H 'Content-Type: application/json' http://localhost:5000/
    ```

    ```sh
    curl -X POST -d '{"operation":"simplifyExpr", "expr":"(x**2+x)/x", "variables":["x"]}' -H 'Content-Type: application/json' http://localhost:5000/
    ```

    ```sh
    curl -X POST -d '{"operation":"factorExpr", "expr":"(x**2 + 2*x + 1)", "variables":["x"]}' -H 'Content-Type: application/json' http://localhost:5000/
    ```

## Running the tests

    ```sh
    python3 -m unittest -v
    ```

    This will look for any files that start with `test_`

## Docker

1. Build the docker image.

    ```sh
    docker build -t calchub/symserver:latest .
    ```
    
2. Run the recently built image.

    ```sh
    docker run -p 5000:5000 --rm calchub/symserver
    ```

3. Push the image up to AWS ECR

    You will need valid AWS credentials to run the following commands.

    ```sh
    # login to aws ecr
    $(aws ecr get-login --no-include-email --region us-west-2)
    
    # tag the newly created image so we can push it up
    # the aws account id here will change based on the environment
    docker tag calchub/symserver:latest 146209622952.dkr.ecr.us-west-2.amazonaws.com/calchub/symserver:latest
    
    # actually push the image to the repo
    docker push 146209622952.dkr.ecr.us-west-2.amazonaws.com/calchub/symserver:latest
    ```
    