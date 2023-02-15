from re import S
from xmlrpc.server import ServerHTMLDoc
from typing import List
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *
from PyQt5.QtCore import Qt
from PyQt5.QtCore import pyqtSignal, QObject, QEventLoop

import socketio
import asyncio

from functools import cached_property

class Door:
    def __init__(self, lockId, doorName, isOpen):
        self.lockId = lockId
        self.doorName = doorName
        self.isOpen = isOpen
doorList = []



class Client(QObject):
    connected = pyqtSignal()
    disconnected = pyqtSignal()
    error_ocurred = pyqtSignal(object, name="errorOcurred")
    data_changed = pyqtSignal(str, name="dataChanged")

    def __init__(self, parent=None):
        super().__init__(parent)

        self.sio.on("dashboardRes", self.res, namespace=None)
        self.sio.on("connect_error", self._handle_connect_error, namespace=None)
        self.sio.on("disconnect", self._handle_disconnect, namespace=None)
        self.sio.on("/client_Unlock", self.client_unlock_ack, namespace=None)

    @cached_property
    def sio(self):
        return socketio.AsyncClient(
            reconnection=True,
            reconnection_attempts=3,
            reconnection_delay=5,
            reconnection_delay_max=5,
            logger=True,
        )

    async def start(self):
        await self.sio.connect(url='http://localhost:4000')
        await self.sio.emit("dashboardRequest")
        #await sio.wait()

    def _handle_connect(self):
        print('connection2222 established')

    def _handle_disconnect(self):
        print('disconnected from server')

    def _handle_connect_error(self, data):
        self.error_ocurred.emit(data)

    def client_unlock_ack(self, data):
        self.data_changed.emit(data)

    async def res(data):
        print(data)
        for element in data:
            print(element)
            doorList.append(Door(lockId=element['lockID'],doorName=element['doorName'],isOpen=element['isOpen']))      
        print('message received with ', data)
        #await sio.emit('my response', {'response': 'my response'})
    
class Window(QMainWindow):
    def __init__(self, parent=None):
        
        super().__init__(parent)
        
        self.setWindowTitle('PyQt6 Lab')
        self.setFixedHeight(400)
        self.setFixedWidth(600)
        self.move(60, 15)
        self.create_menu()
        self.create_tabs()
        self.create_editor()
        self.create_appender()

    
    def create_menu(self):
        self.menu = self.menuBar()

        self.fileMenu = self.menu.addMenu("File")

        self.actionExit = QAction('Exit', self)
        self.actionExit.setShortcut('Ctrl+Q')
        self.actionExit.triggered.connect(self.close)
        self.fileMenu.addAction(self.actionExit)
        
    def create_tabs(self):
        self.tabs = QTabWidget()
        
        self.tab_1 = QWidget()
        self.tab_2 = QWidget()
        self.tab_3 = QWidget()
        if doorList:
            for i in doorList:
                self.tabs.addTab(QWidget(), i.doorName)        
            print("enpty")
        self.setCentralWidget(self.tabs)


    def create_editor(self):
        self.text = ''
        self.editedFile = None
        outerLayout = QVBoxLayout(self.tab_2)
        innerLayout = QHBoxLayout()

        saveButton = QPushButton("Zapisz")
        saveButton.clicked.connect(self.save)

        clearButton = QPushButton("Wyczyść")
        clearButton.clicked.connect(self.clearText)

        innerLayout.addWidget(saveButton)
        innerLayout.addWidget(clearButton)

        self.editor = QPlainTextEdit()
        outerLayout.addWidget(self.editor)
        outerLayout.addLayout(innerLayout)
        

    def create_appender(self):
        layout = QGridLayout(self.tab_3)


        self.textInput1 = QLineEdit()
        textInput1Label = QLabel("Pole A")
        self.textInput1.textChanged.connect(self.append)

        self.textInput2 = QLineEdit()
        textInput2Label = QLabel("Pole B")
        self.textInput2.textChanged.connect(self.append)
        
        self.numericInput = QSpinBox()
        self.numericInput.setRange(0, 9999)
        numericInputLabel = QLabel("Pole C")
        self.numericInput.clear()
        self.numericInput.textChanged.connect(self.append)

        self.resultField = QLineEdit()
        self.resultField.setEnabled(False)
        resultFieldLabel = QLabel("Pole A+B+C")

        layout.addWidget(textInput1Label, 0, 0)
        layout.addWidget(self.textInput1, 0, 1)
        layout.addWidget(textInput2Label, 1, 0)
        layout.addWidget(self.textInput2, 1, 1)
        layout.addWidget(numericInputLabel, 2, 0)
        layout.addWidget(self.numericInput, 2, 1)
        layout.addWidget(resultFieldLabel, 3, 0)
        layout.addWidget(self.resultField, 3, 1)


    def openImage(self):
        fileName, selectedFilter = QFileDialog.getOpenFileName(self.tab_1, "Wybierz plik obrazu",  "", "PNG (*.png)")

        if fileName:
            label = QLabel(self.tab_1)
            pixmap = QPixmap(fileName)
            label.setPixmap(pixmap.scaled(self.tab_1.width(), self.tab_1.height(), Qt.AspectRatioMode.KeepAspectRatio))
            label.show()

    def clearText(self):
        print("clear text")
        self.text = ''
        self.editor.setPlainText(self.text)

    def openText(self):
        fileName, selectedFilter = QFileDialog.getOpenFileName(self.tab_2, "Wybierz plik tekstowy",  "", "TXT (*.txt)")

        if fileName:
            self.editedFile = fileName
            with open(self.editedFile, 'r') as file:
                self.text = file.read()
                print(file.read())
                self.editor.setPlainText(self.text)
        
    def saveText(self):
        if self.editedFile:
            self.save()
        else:
            self.saveTextAs()
            
    def saveTextAs(self):
        fileName, selectedFilter = QFileDialog.getSaveFileName(self.tab_2, "Wybierz plik tekstowy",  "", "TXT (*.txt)")

        if fileName:
            self.editedFile = fileName
            self.save()

    def save(self):
        text = self.editor.toPlainText()
        with open(self.editedFile, 'w') as file:
            file.write(text)

    def clearInput(self):
        self.textInput1.clear()
        self.textInput2.clear()
        self.numericInput.clear()
        self.numericInput.v
        self.resultField.clear()

        
    def append(self):
        self.resultField.setText(self.textInput1.text() + self.textInput2.text() + str(self.numericInput.value() ))
        

app = QApplication([])
loop = QEventLoop(app)
asyncio.set_event_loop(loop)
win = Window()
win.show()
#asyncio.run(start())
client = Client()
client.data_changed.connect(win.update_data)
with loop:
        asyncio.ensure_future(client.start(), loop=loop)
        loop.run_forever()
app.exec()