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
class Tab:
    def __init__(self, qWidget, door):
        self.qWidget = qWidget
        self.door = door
doorList = []
tabList = []


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
        await self.sio.wait()
        await self.sio.disconnect()

    def _handle_connect(self):
        print('connection2222 established')

    def _handle_disconnect(self):
        print('disconnected from server')

    def _handle_connect_error(self, data):
        self.error_ocurred.emit(data)

    def client_unlock_ack(self, data):
        self.data_changed.emit(data)

    async def res(self,data):
        print(data)
        for element in data:
            print(element)
            doorList.append(Door(lockId=element['lockID'],doorName=element['doorName'],isOpen=element['isOpen']))      
        print('message received with ', data)
        await self.sio.disconnect()
        #self.disconnect.emit()
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

    
    def create_menu(self):
        self.menu = self.menuBar()

        self.fileMenu = self.menu.addMenu("File")

        self.actionExit = QAction('Exit', self)
        self.actionExit.setShortcut('Ctrl+Q')
        self.actionExit.triggered.connect(self.close)
        self.fileMenu.addAction(self.actionExit)
        
    def create_tabs(self):
        self.tabs = QTabWidget()
        if doorList:
            for i in doorList:
                tabList.append(Tab(qWidget=QWidget(),door=i))
            for i in tabList:
                self.tabs.addTab(i.qWidget, i.door.doorName)        
        self.setCentralWidget(self.tabs)
        
    def create_appender(self):
        if doorList:
            for i in tabList:
                layout = QGridLayout(i.qWidget)

                nameLabel = QLabel("name: "+i.door.doorName)
                idLabel = QLabel("id: "+i.door.lockId)
                openLabel = QLabel("name: true" if i.door.isOpen else "name: false")
            
                layout.addWidget(nameLabel, 0, 0)
                layout.addWidget(idLabel, 1, 0)
                layout.addWidget(openLabel, 2, 0)

    def openImage(self):
        fileName, selectedFilter = QFileDialog.getOpenFileName(self.tab_1, "Wybierz plik obrazu",  "", "PNG (*.png)")

        if fileName:
            label = QLabel(self.tab_1)
            pixmap = QPixmap(fileName)
            label.setPixmap(pixmap.scaled(self.tab_1.width(), self.tab_1.height(), Qt.AspectRatioMode.KeepAspectRatio))
            label.show()
        

app = QApplication([])
loop = asyncio.get_event_loop()
asyncio.set_event_loop(loop)
win = Window()
win.show()
client = Client()
asyncio.run(client.start())
win.create_tabs()
win.create_appender()
# win2 = Window()
# win2.show()
#loop = asyncio.get_event_loop()
#/asyncio.run(amain(loop=loop))
#with loop:
 #       asyncio.ensure_future(client.start(), loop=loop)
#       loop.run_forever()
app.exec()