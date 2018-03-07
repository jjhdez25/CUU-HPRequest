using System;

public class ClassDataException : ApplicationException
{

    public ClassDataException(string mensaje, Exception original)
        : base(mensaje, original)
    {
    }

    public ClassDataException(string mensaje)
        : base(mensaje)
    {
    }

}