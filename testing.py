def a(callback):
    print("a")
    callback()

def b():
    print("b")

a(b)