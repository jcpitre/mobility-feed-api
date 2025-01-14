#
#
#  MobilityData 2023
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
#

# Executes the python function passed as argument supported by the functions-framework.
# The script receives the name of the function as parameter.
# The function must be located in the folder `functions-python/<function_name>`.
# The function must be defined in the file `functions-python/<function_name>/main.py`.
# The script look for a `.env.local` file in the function's folder to load environment variables.

# Usage:
#   function-python-run.sh --function_name <function name>
# Example:
#   function-python-run.sh --function_name tokens

# relative path
SCRIPT_PATH="$(dirname -- "${BASH_SOURCE[0]}")"
FUNCTIONS_PATH="$SCRIPT_PATH/../functions-python"

# function printing usage
display_usage() {
  printf "\nThis script executes a python function"
  printf "\nScript Usage:\n"
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -h|--help                           Display help content."
  echo "  --function_name <FUNCTION_NAME>     Name of the function to be executed."
  exit 1
}

function_name=''
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
  -h | --help)
    display_usage
    exit 0
    ;;
  --function_name)
    function_name="$2"
    shift # past argument
    shift # past value
    ;;
  *)      # unknown option
    shift # past argument
    ;;
  esac
done

export PYTHONPATH="$FUNCTIONS_PATH:$PYTHONPATH"
FX_PATH="$FUNCTIONS_PATH/$function_name/src"

if [ ! -d "$FX_PATH" ]; then
  printf "\nERROR: function's folder not found at location: %s\n" "$FX_PATH"
  display_usage
  exit 1
fi

if [ ! -f "$FX_PATH/../.env.local" ]; then
  printf "\nWARN: .env.local file not found at location: %s/.env.local" "$FX_PATH"
else
  source "$FX_PATH/../.env.local"
fi

# extract the --target value from the function's name main.py file with @functions_framework.http annotation
target=$(grep -zoE "@functions_framework\.http\s*\n\s*def [a-zA-Z_][a-zA-Z_0-9]*" "$FX_PATH/main.py" | grep -oE "def [a-zA-Z_][a-zA-Z_0-9]*" | cut -d ' ' -f 2)

# verify if the target is not empty
if [ -z "$target" ]; then
  printf "\nERROR: function's main.py file does not contain a @functions_framework.http annotation"
  display_usage
  exit 1
fi

functions-framework --target "$target" --debug --source "$FX_PATH/main.py" --signature-type http
