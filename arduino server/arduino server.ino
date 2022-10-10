const int POTEN = A0;
const int BTN = 2;

int potenValue = 0;
int previousPotenValue = potenValue;

bool btnPressed = false;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);

  pinMode(POTEN, INPUT);
  pinMode(BTN, INPUT);

}

void loop() {
  // put your main code here, to run repeatedly:
  potenValue = analogRead(POTEN);  
  btnPressed = digitalRead(BTN);


  if (previousPotenValue != potenValue) {
     Serial.print('0');
    Serial.print(' ');
    Serial.print(potenValue);
    Serial.println();
    previousPotenValue = potenValue;
  }


  if(btnPressed){
    Serial.print('A');
    Serial.print(' ');
    Serial.print(potenValue);
    Serial.println();
    }


}
