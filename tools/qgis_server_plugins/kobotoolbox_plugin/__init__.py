def serverClassFactory(serverIface):
    from .kobotoolbox_service import KoboToolboxServerPlugin
    return KoboToolboxServerPlugin(serverIface)
